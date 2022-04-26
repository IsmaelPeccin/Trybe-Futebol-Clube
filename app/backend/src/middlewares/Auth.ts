import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { IUser } from '../interfaces/user';

const SECRET = fs.readFileSync('jwt.evaluation.key', 'utf8');

const JWT_OPTIONS: jwt.SignOptions = {
  algorithm: 'HS256',
  expiresIn: '7d',
};

export default abstract class AuthMiddleware {
  static generateToken(payload: IUser): string {
    return jwt.sign(payload, SECRET, JWT_OPTIONS);
  }

  static verifyToken(token: string): IUser {
    return jwt.verify(token, SECRET) as IUser;
  }
}
