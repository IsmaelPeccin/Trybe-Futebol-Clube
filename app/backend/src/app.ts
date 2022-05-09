import * as express from 'express';
import LeaderboardController from './controller/LeaderboardController';
import MatchesController from './controller/MatchesController';
import TeamsController from './controller/TeamsController';
import UserController from './controller/UserController';
import { ILeaderboardController, ILeaderboardService, ILoginService,
  IMatchesController,
  IMatchesService,
  ITeamsController,
  ITeamsService,
  IUserController } from './interfaces';
import errorMiddleware from './middlewares/errorMiddleware';
import ValidateUser from './middlewares/validateUser';
import LeaderboardService from './service/LeaderboardService';
import MatchesService from './service/MatchesService';
import TeamsService from './service/TeamsService';
import UserService from './service/UserService';

class App {
  public app: express.Express;

  private _userController: IUserController;

  private _userService: ILoginService;

  private _teamsController: ITeamsController;

  private _teamsService: ITeamsService;

  private _matchesController: IMatchesController;

  private _matchesService: IMatchesService;

  private _leaderboardController: ILeaderboardController;

  private _leaderboardService: ILeaderboardService;

  constructor() {
    this._userService = new UserService();
    this._userController = new UserController(this._userService);

    this._teamsService = new TeamsService();
    this._teamsController = new TeamsController(this._teamsService);

    this._matchesService = new MatchesService();
    this._matchesController = new MatchesController(this._matchesService);

    this._leaderboardService = new LeaderboardService();
    this._leaderboardController = new LeaderboardController(this._leaderboardService);

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

    this.app.get('/teams/:id', this._teamsController.findByIdController);
  }

  private matchesRouter():void {
    this.app.get('/matches', this._matchesController.listMatchesController);

    this.app.post(
      '/matches',
      this._matchesController.createMatchController,
    );

    this.app.patch(
      '/matches/:id/finish',
      this._matchesController.finishMatch,
    );

    this.app.patch(
      '/matches/:id',
      this._matchesController.updateResultMatch,
    );
  }

  private leaderboardRouter():void {
    this.app.get('/leaderboard/home', this._leaderboardController.getLeaderboardHome);

    this.app.get('/leaderboard/away', this._leaderboardController.getLeaderboardAway);
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
    this.matchesRouter();
    this.leaderboardRouter();
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
