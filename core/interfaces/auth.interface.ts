import { IAddress, IUser } from "./user.interface";

export interface IRegister {
    name: string;
    email: string;
    password: string;
    phone: string;
    addresses: IAddress[];
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IAuthResponse {
    status: string;
    message: string;
    token: string;
}

export interface ITokenDecode {
    id: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
}