import { Request, Response, NextFunction } from 'express';

export interface IUser {
  id?: number;
  username: string;
  role: string;
  email: string;
}

export interface IUserInfo {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}

export interface ILoginService {
  login(userData: IUserInfo): Promise<ILoginResponse | boolean>;
  validateLogin?(token: string): string;
}

export interface IUserController {
  loginController(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  validateLoginController(
    req: Request,
    res: Response,
    next: NextFunction)
  : Promise<void | Response>;
}
