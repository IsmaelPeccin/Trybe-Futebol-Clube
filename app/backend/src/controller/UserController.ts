import { Request, Response, NextFunction } from 'express';
import UserService from '../service/UserService';
import { ILoginService, IUserInfo } from '../interfaces/user';

export default class UserController {
  constructor(private userService: ILoginService) {}

  loginController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const userData = req.body as IUserInfo;

      const response = await this.userService.login(userData);

      if (!response) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  validateLoginController = async (
    req: Request,
    res: Response,
    next:NextFunction,
  ): Promise<void | Response> => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({ message: 'Token not found' });
      }

      const response = UserService.validateLogin(authorization);

      if (!response) {
        return res.status(401).json({ message: 'Token is invalid' });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
