import * as express from 'express';
import UserController from './controller/UserController';
import { ILoginService, IUserController } from './interfaces';
import errorMiddleware from './middlewares/errorMiddleware';
import ValidateUser from './middlewares/validateUser';
import UserService from './service/UserService';

class App {
  public app: express.Express;

  private _userService: ILoginService;

  private _userController: IUserController;

  constructor() {
    this._userService = new UserService();

    this._userController = new UserController(this._userService);

    this.app = express();

    this.config();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
    this.app.post('/login', ValidateUser.validateUser, this._userController.loginController);
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
