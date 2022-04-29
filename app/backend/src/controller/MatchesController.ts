import { Request, Response, NextFunction } from 'express';
import { IMatchesService } from '../interfaces';

export default class MatchesController {
  constructor(private matchesService: IMatchesService) {}

  listMatchesController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  )
  : Promise<void | Response> => {
    try {
      const { inProgress } = req.query;

      if (inProgress === 'true' || inProgress === 'false') {
        const matches = await this.matchesService.findInProgress(
          JSON.parse(inProgress),
        );

        return res.status(200).json(matches);
      }
      const allMatches = await this.matchesService.listMatches();
      return res.status(200).json(allMatches);
    } catch (error) {
      next(error);
    }
  };
}
