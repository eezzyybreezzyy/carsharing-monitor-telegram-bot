import {IUser} from './IUser';

export interface IUsersService {
    getUserById(id: number): IUser;
}