import { Request, Response, NextFunction } from 'express';
import { ILoginService, IUserInfo } from '../interfaces/user';

export default class UserController {
  constructor(private userService: ILoginService) {}

  loginController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const userInfo: IUserInfo = req.body;

      const response = await this.userService.login(userInfo);

      if (!response) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
