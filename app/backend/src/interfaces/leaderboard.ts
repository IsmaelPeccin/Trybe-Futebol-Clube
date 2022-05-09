import { NextFunction, Request, Response } from 'express';

export interface ILeaderboard {
  id?: number;
  name?: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}

export interface ILeaderboardService {
  createHomeLeaderboard(): Promise<ILeaderboard[]>;
  createAwayLeaderboard(): Promise<ILeaderboard[]>;
}

export interface ILeaderboardController {
  getLeaderboardHome(_req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getLeaderboardAway(_req: Request, res: Response, next: NextFunction): Promise<void | Response>;
}
