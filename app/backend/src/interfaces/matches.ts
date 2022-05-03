import { Response, Request, NextFunction } from 'express';

export interface IMatches extends ICreateMatch {
  id: number;
}

export interface ICreateMatch {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress?: boolean;
}

export interface IMatchesService {
  listMatches(): Promise<IMatches[]>;
  findInProgress(query: boolean): Promise<IMatches[]>;
  createMatch(matchData: ICreateMatch): Promise<IMatches>;
}

export interface IMatchesController {
  listMatchesController(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  createMatchController(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
}
