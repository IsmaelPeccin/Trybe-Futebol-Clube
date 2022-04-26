import { compare } from 'bcryptjs';
import { IUserValidate, ILoginResponse, IResponse } from '../interfaces/user';
import User from '../database/models/UsersModel';
import AuthMiddleware from '../middlewares/Auth';

export default class UserService {
  private _userModel;

  constructor() {
    this._userModel = User;
  }

  public async login(userData: IUserValidate): Promise<ILoginResponse | IResponse> {
    const response = await this._userModel.findOne({ where: { email: userData.email } });

    if (!response || !await compare(userData.password, response.password)) {
      return {
        message: 'Incorrect email or password',
        code: 401,
      };
    }
    const genToken = AuthMiddleware.generateToken(response);
    return {
      user: {
        id: response.id,
        username: response.username,
        role: response.role,
        email: response.email,
      },
      token: genToken,
    };
  }
}
