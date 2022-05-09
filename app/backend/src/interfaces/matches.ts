import { Response, Request, NextFunction } from 'express';

export interface IMatches extends ICreateMatch {
  id?: number;
}

export interface ICreateMatch {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export interface ITeamsMatches {
  id: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
  teamHome: {
    teamName: string;
  },
  teamAway: {
    teamName: string;
  }
}

export interface IMatchesHome {
  id: any;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
  teamHome: {
    teamName: string;
  }
}

export interface IUpdateResult {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface IMatchesService {
  listMatches(): Promise<IMatches[]>;
  findInProgress(query: boolean): Promise<IMatches[]>;
  createMatch(matchData: ICreateMatch): Promise<IMatches>;
  finishMatch(id: number): Promise<boolean | undefined>;
  updateResultMatch(id: number, result: IUpdateResult): Promise<boolean | undefined>;
}

export interface IMatchesController {
  listMatchesController(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  createMatchController(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  finishMatch(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  updateResultMatch(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
}
