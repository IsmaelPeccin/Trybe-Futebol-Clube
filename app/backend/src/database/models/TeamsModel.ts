import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class Teams extends Model {
  public id!: number;

  public teamName!: string;
}

Teams.init({
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  teamName: {
    type: STRING(50),
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

export default Teams;
