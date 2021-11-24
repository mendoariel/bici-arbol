import { Injectable } from '@nestjs/common';
import exp from 'constants';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from 'src/user/model/dto/create-user.dto';
import { LoginUserDto } from 'src/user/model/dto/login-user.dto';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class UserHelperService {
    createUserDtoEntity(createUserDto: CreateUserDto):Observable<UserI> {
        
        
    
        return of({
            email: createUserDto.email,
            username: createUserDto.username,
            password: createUserDto.password,
            recoveryPasswordToken: 'gato',
            passTokenExpire: 'perro'
        })
    }

    loginUserDto(loginUserDto: LoginUserDto):Observable<UserI> {
        return of({
            email: loginUserDto.email,
            password: loginUserDto.password
        })
    }
}
