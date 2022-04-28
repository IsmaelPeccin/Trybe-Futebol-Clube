import { Request, Response, NextFunction } from 'express';
import { IMatchesService } from '../interfaces';

export default class MatchesController {
  constructor(private matchesService: IMatchesService) {}

  listMatchesController = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  )
  : Promise<void | Response> => {
    try {
      const response = await this.matchesService.listMatches();

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
