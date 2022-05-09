import { Request, Response, NextFunction } from 'express';
import { ILeaderboardService } from '../interfaces';

export default class LeaderboardController {
  constructor(private leaderboardService: ILeaderboardService) {}

  getLeaderboardHome = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  )
  : Promise<void | Response> => {
    try {
      const result = await this.leaderboardService.createHomeLeaderboard();

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getLeaderboardAway = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) : Promise<void | Response> => {
    try {
      const result = await this.leaderboardService.createAwayLeaderboard();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
