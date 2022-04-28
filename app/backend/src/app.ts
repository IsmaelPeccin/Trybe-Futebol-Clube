import * as express from 'express';
import TeamsController from './controller/TeamsController';
import UserController from './controller/UserController';
import { ILoginService, ITeamsController, ITeamsService, IUserController } from './interfaces';
import errorMiddleware from './middlewares/errorMiddleware';
import ValidateUser from './middlewares/validateUser';
import TeamsService from './service/TeamsService';
import UserService from './service/UserService';

class App {
  public app: express.Express;

  private _userController: IUserController;

  private _userService: ILoginService;

  private _teamsController: ITeamsController;

  private _teamsService: ITeamsService;

  constructor() {
    this._userService = new UserService();
    this._userController = new UserController(this._userService);

    this._teamsService = new TeamsService();
    this._teamsController = new TeamsController(this._teamsService);

    this.app = express();
    this.app.use(express.json());
    this.config();
  }

  private loginRouter():void {
    this.app.post('/login', ValidateUser.validateUser, this._userController.loginController);

    this.app.get('/login/validate', this._userController.validateLoginController);
  }

  private teamsRouter():void {
    this.app.get('/teams', this._teamsController.listTeamsController);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.loginRouter();
    this.teamsRouter();
    this.app.use(errorMiddleware);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
