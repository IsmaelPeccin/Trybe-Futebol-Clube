import { Response, Request, NextFunction } from 'express';

export interface IMatches {
  id: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export interface IMatchesService {
  listMatches(): Promise<IMatches[]>;
}

export interface IMatchesController {
  listMatchesController(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
}
