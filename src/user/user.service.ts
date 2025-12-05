import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    private users = [{
        id: 0,
        name: 'Alex',
        password: 'weqweqw',
        age: 21
    }];


    public getInfo() {
        return this.users
    }

    public create (dto:CreateDto) {
        const newUser = {
            id:this.users.length++,
            name:dto.name,
            password:dto.password,
            age:dto.age
        };

        this.users.push(newUser);

        return true
    }

}
