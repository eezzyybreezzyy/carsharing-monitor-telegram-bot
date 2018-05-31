import TelegramBot from 'node-telegram-bot-api';

import {User, IUser} from './user';

export interface IUsersService {
    getUserById(id: number): IUser;
}

export class UsersService implements IUsersService {
    private users: IUser[] = [];

    constructor() {
        // this.users = loadUsersFromDb();
    }

    getUserById(id: number): IUser {
        const user = this.users.find(item => item.id === id);

        return user || this.createNewUser(id);
    }

    private createNewUser(id: number): IUser {
        const newUser = new User(id);
            
        this.users.push(newUser);

        return newUser;
    }
}
