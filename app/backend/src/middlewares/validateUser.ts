import { Request, Response, NextFunction } from 'express';
import { IUserInfo } from '../interfaces/user';

export default class ValidateUser {
  public static async validateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const { email, password } = req.body as IUserInfo;
    const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!email.match(regexEmail) || password.length < 7) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    next();
  }
}
