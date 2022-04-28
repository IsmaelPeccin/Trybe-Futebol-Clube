import { ITeams } from '../interfaces';
import Teams from '../database/models/TeamsModel';

export default class TeamsService {
  private _teamsModel;

  constructor() {
    this._teamsModel = Teams;
  }

  public async listTeams(): Promise<ITeams []> {
    return this._teamsModel.findAll({
      attributes: ['id', 'teamName'],
    });
  }

  public async findById(id: number): Promise<ITeams | null> {
    return this._teamsModel.findByPk(id);
  }
}
