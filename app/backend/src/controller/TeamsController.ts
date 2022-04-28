import { Request, Response, NextFunction } from 'express';
import { ITeamsService } from '../interfaces';

export default class TeamsController {
  constructor(private teamsService: ITeamsService) {}

  listTeamsController = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  )
  : Promise<void | Response> => {
    try {
      const response = await this.teamsService.listTeams();

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  findByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  )
  : Promise<void | Response> => {
    try {
      const { id } = req.params;

      const response = await this.teamsService.findById(+id);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
