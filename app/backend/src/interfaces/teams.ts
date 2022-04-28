import { Response, Request, NextFunction } from 'express';

export interface ITeams {
  id: number;
  teamName: string;
}

export interface ITeamsService {
  listTeams(): Promise<ITeams[]>;
  findById(id: number): Promise<ITeams | null>;
}

export interface ITeamsController {
  listTeamsController(_req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  findByIdController(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
}
