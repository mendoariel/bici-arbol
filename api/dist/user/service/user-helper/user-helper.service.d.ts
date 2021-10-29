import { Observable } from 'rxjs';
import { CreateUserDto } from 'src/user/model/dto/create-user.dto';
import { LoginUserDto } from 'src/user/model/dto/login-user.dto';
import { UserI } from 'src/user/model/user.interface';
export declare class UserHelperService {
    createUserDtoEntity(createUserDto: CreateUserDto): Observable<UserI>;
    loginUserDto(loginUserDto: LoginUserDto): Observable<UserI>;
}
