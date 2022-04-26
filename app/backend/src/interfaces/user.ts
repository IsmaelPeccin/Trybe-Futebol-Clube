export interface IUser {
  id?: number;
  username: string;
  role: string;
  email: string;
}

export interface IUserValidate {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}

export interface IResponse {
  message: string;
  code: number;
}
