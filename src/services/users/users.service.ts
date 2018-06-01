import {User} from './user';

import {IUsersService} from '../../models/user/IUserService';
import {IUser} from '../../models/user/IUser';


export class UsersService implements IUsersService {
    private users: User[] = [];

    constructor() {
        // this.users = loadUsersFromDb();
    }

    getUserById(id: number): User {
        const user = this.users.find(item => item.id === id);

        return user || this.createNewUser(id);
    }

    private createNewUser(id: number): User {
        const newUser = new User(id);

        this.users.push(newUser);

        return newUser;
    }
}
