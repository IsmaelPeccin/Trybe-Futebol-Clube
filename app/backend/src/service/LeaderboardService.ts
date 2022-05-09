import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import { ILeaderboard, IMatches, ITeams } from '../interfaces';

export default class LeaderboardService {
  private _matchesModel;

  private _teamsModel;

  constructor() {
    this._matchesModel = Matches;
    this._teamsModel = Teams;
  }

  static initialLeaderboard = () => {
    const initialBoard = {
      name: '',
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    };
    return initialBoard;
  };

  matchesFinished = async (): Promise<IMatches[]> => {
    const matches = await this._matchesModel.findAll({
      where: {
        inProgress: false,
      },
    });
    return matches;
  };

  allTeams = async (): Promise<ITeams[]> => {
    const teams = await this._teamsModel.findAll();
    return teams;
  };

  static totalWins = (homeTeamGoals: number, awayTeamGoals:number, homeOrAway:string) => {
    let wins = 0;
    if (homeOrAway === 'home' && homeTeamGoals > awayTeamGoals) wins += 1;
    if (homeOrAway === 'away' && awayTeamGoals > homeTeamGoals) wins += 1;
    return wins;
  };

  static totalLoses = (homeTeamGoals: number, awayTeamGoals:number, homeOrAway:string) => {
    let loses = 0;
    if (homeOrAway === 'home') {
      if (awayTeamGoals > homeTeamGoals) {
        loses += 1;
      }
      return loses;
    }
    if (homeOrAway === 'away') {
      if (homeTeamGoals > awayTeamGoals) {
        loses += 1;
      }
      return loses;
    }
  };

  static totalDraws = (homeTeamGoals: number, awayTeamGoals:number) => {
    let draws = 0;
    if (homeTeamGoals === awayTeamGoals) draws += 1;
    return draws;
  };

  static totalGamesHome = (homeTeamGoals: number, awayTeamGoals:number) => {
    const draws = this.totalDraws(homeTeamGoals, awayTeamGoals);
    const wins = this.totalWins(homeTeamGoals, awayTeamGoals, 'home') as number;
    const loses = this.totalLoses(homeTeamGoals, awayTeamGoals, 'home') as number;
    return (wins + draws + loses);
  };

  static totalGamesAway = (homeTeamGoals: number, awayTeamGoals:number) => {
    const draws = this.totalDraws(homeTeamGoals, awayTeamGoals);
    const wins = this.totalWins(homeTeamGoals, awayTeamGoals, 'away') as number;
    const loses = this.totalLoses(homeTeamGoals, awayTeamGoals, 'away') as number;
    return (wins + draws + loses);
  };

  static totalPoints = (homeTeamGoals:number, awayTeamGoals:number, homeOrAway:string) => {
    if (homeOrAway === 'home' && homeTeamGoals > awayTeamGoals) return 3;
    if (homeOrAway === 'away' && homeTeamGoals < awayTeamGoals) return 3;
    if (homeTeamGoals === awayTeamGoals) return 1;
    return 0;
  };

  static efficiency =
  (totalGames:number, totalPoints:number) => ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

  matchesMapHome = async () => {
    const allMatches = await this.matchesFinished();
    const allMatchesMap = allMatches.map((match) => ({
      id: match.id,
      homeId: match.homeTeam,
      totalPoints: LeaderboardService.totalPoints(match.homeTeamGoals, match.awayTeamGoals, 'home'),
      totalGames: LeaderboardService.totalGamesHome(match.homeTeamGoals, match.awayTeamGoals),
      totalVictories: LeaderboardService
        .totalWins(match.homeTeamGoals, match.awayTeamGoals, 'home') as number,
      totalDraws: LeaderboardService.totalDraws(match.homeTeamGoals, match.awayTeamGoals),
      totalLosses: LeaderboardService.totalLoses(match.homeTeamGoals, match.awayTeamGoals, 'home'),
      goalsFavor: match.homeTeamGoals,
      goalsOwn: match.awayTeamGoals,
      goalsBalance: match.homeTeamGoals - match.awayTeamGoals,
    }));
    return allMatchesMap;
  };

  matchesMapAway = async () => {
    const allMatches = await this.matchesFinished();
    const allMatchesMap = allMatches.map((match) => ({
      id: match.id,
      awayId: match.awayTeam,
      totalPoints: LeaderboardService.totalPoints(match.homeTeamGoals, match.awayTeamGoals, 'away'),
      totalGames: LeaderboardService.totalGamesAway(match.homeTeamGoals, match.awayTeamGoals),
      totalVictories: LeaderboardService
        .totalWins(match.homeTeamGoals, match.awayTeamGoals, 'away') as number,
      totalDraws: LeaderboardService.totalDraws(match.homeTeamGoals, match.awayTeamGoals),
      totalLosses: LeaderboardService.totalLoses(match.homeTeamGoals, match.awayTeamGoals, 'away'),
      goalsFavor: match.awayTeamGoals,
      goalsOwn: match.homeTeamGoals,
      goalsBalance: match.awayTeamGoals - match.homeTeamGoals,
    }));
    return allMatchesMap;
  };

  checkHome = async (leaderboard: ILeaderboard, team: ITeams) => {
    const allMatchesMap = await this.matchesMapHome();
    const newBoard = leaderboard;
    allMatchesMap.forEach((match) => {
      if (match.homeId === team.id) {
        newBoard.name = team.teamName;
        newBoard.totalPoints += match.totalPoints;
        newBoard.totalGames += match.totalGames;
        newBoard.totalVictories += match.totalVictories;
        newBoard.totalDraws += match.totalDraws;
        newBoard.totalLosses += match.totalLosses as number;
        newBoard.goalsFavor += match.goalsFavor;
        newBoard.goalsOwn += match.goalsOwn;
        newBoard.goalsBalance += match.goalsBalance;
        newBoard.efficiency = Number(LeaderboardService
          .efficiency(newBoard.totalGames, newBoard.totalPoints));
      }
    });
    return newBoard;
  };

  checkAway = async (leaderboard: ILeaderboard, team: ITeams) => {
    const allMatchesMap = await this.matchesMapAway();
    const newBoard = leaderboard;
    allMatchesMap.forEach((match) => {
      if (match.awayId === team.id) {
        newBoard.name = team.teamName;
        newBoard.totalPoints += match.totalPoints;
        newBoard.totalGames += match.totalGames;
        newBoard.totalVictories += match.totalVictories;
        newBoard.totalDraws += match.totalDraws;
        newBoard.totalLosses += match.totalLosses as number;
        newBoard.goalsFavor += match.goalsFavor;
        newBoard.goalsOwn += match.goalsOwn;
        newBoard.goalsBalance += match.goalsBalance;
        newBoard.efficiency = Number(LeaderboardService
          .efficiency(newBoard.totalGames, newBoard.totalPoints));
      }
    });
    return newBoard;
  };

  sortLeaderboard = async (leaderboard: ILeaderboard[]) => {
    const sortTeams = leaderboard;

    sortTeams.sort((teamA, teamB) => teamB.goalsOwn - teamA.goalsOwn)
      .sort((teamA, teamB) => teamB.goalsFavor - teamA.goalsFavor)
      .sort((teamA, teamB) => teamB.goalsBalance - teamA.goalsBalance)
      .sort((teamA, teamB) => teamB.totalVictories - teamA.totalVictories)
      .sort((teamA, teamB) => teamB.totalPoints - teamA.totalPoints);

    return sortTeams;
  };

  createHomeLeaderboard = async () => {
    const allTeams = await this.allTeams();
    const mapTeams = Promise.all(allTeams.map((team) => {
      const initialBoard = LeaderboardService.initialLeaderboard();
      const secondBoard = this.checkHome(initialBoard, team);
      return secondBoard;
    }));
    const sortTeams = await this.sortLeaderboard(await mapTeams);
    return sortTeams;
  };

  createAwayLeaderboard = async () => {
    const allTeams = await this.allTeams();
    const mapTeams = Promise.all(allTeams.map((team) => {
      const initialBoard = LeaderboardService.initialLeaderboard();
      const secondBoard = this.checkAway(initialBoard, team);
      return secondBoard;
    }));
    const sortTeams = await this.sortLeaderboard(await mapTeams);
    return sortTeams;
  };
}
