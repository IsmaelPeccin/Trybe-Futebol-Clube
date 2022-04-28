import { Response, Request, NextFunction } from 'express';

export interface ITeams {
  id: number;
  teamName: string;
}

export interface ITeamsService {
  listTeams(): Promise<ITeams[]>;
}

export interface ITeamsController {
  listTeamsController(_req: Request, res: Response, next: NextFunction): Promise<void | Response>;
}
