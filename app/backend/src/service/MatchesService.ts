import Teams from '../database/models/TeamsModel';
import { ICreateMatch, IMatches, IUpdateResult } from '../interfaces';
import Matches from '../database/models/MatchesModel';

export default class MatchesService {
  private _matchesModel;

  constructor() {
    this._matchesModel = Matches;
  }

  public async listMatches(): Promise<IMatches[]> {
    return this._matchesModel.findAll({
      include: [
        { model: Teams, as: 'teamHome', attributes: ['teamName'] },
        { model: Teams, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
  }

  public async findInProgress(query: boolean): Promise<IMatches[]> {
    return this._matchesModel.findAll({
      where: {
        inProgress: query,
      },
      include: [
        { model: Teams, as: 'teamHome', attributes: ['teamName'] },
        { model: Teams, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
  }

  public async createMatch(matchData: ICreateMatch): Promise<IMatches> {
    return this._matchesModel.create({
      homeTeam: matchData.homeTeam,
      awayTeam: matchData.awayTeam,
      homeTeamGoals: matchData.homeTeamGoals,
      awayTeamGoals: matchData.awayTeamGoals,
      inProgress: true,
    });
  }

  public async finishMatch(id: number): Promise<boolean | undefined> {
    const match = await this._matchesModel.findByPk(id);

    if (!match) return false;

    const updateMatch = await this._matchesModel.update(
      {
        inProgress: false,
      },
      {
        where: {
          id,
        },
      },
    );
    if (updateMatch) {
      return true;
    }
  }

  public async updateResultMatch(id: number, result: IUpdateResult): Promise<boolean | undefined> {
    const match = await this._matchesModel.findByPk(id);

    if (!match) return false;

    const updateMatch = await this._matchesModel.update(
      {
        homeTeamGoals: result.homeTeamGoals,
        awayTeamGoals: result.awayTeamGoals,
      },
      {
        where: {
          id,
        },
      },
    );
    if (updateMatch) {
      return true;
    }
  }
}
