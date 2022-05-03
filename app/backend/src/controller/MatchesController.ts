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

  createMatchController = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const matchData = req.body;

      if (matchData.awayTeam === matchData.homeTeam) {
        return res.status(401)
          .json({ message: 'It is not possible to create a match with two equal teams' });
      }

      const match = await this.matchesService.createMatch(matchData);

      return res.status(201).json(match);
    } catch (error) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }
  };

  finishMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const match = await this.matchesService.finishMatch(Number(id));

      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }

      return res.status(200).json({ message: 'Match updated' });
    } catch (error) {
      next(error);
    }
  };
}
