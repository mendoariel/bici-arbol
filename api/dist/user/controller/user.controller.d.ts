import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { LoginResponseI } from '../model/login-response.interface';
import { UserI } from '../model/user.interface';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user-service/user.service';
export declare class UserController {
    private userService;
    private userHelperService;
    constructor(userService: UserService, userHelperService: UserHelperService);
    create(createUserDto: CreateUserDto): Observable<UserI>;
    findAll(page?: number, limit?: number): Observable<Pagination<UserI>>;
    login(loginUserDto: LoginUserDto): Observable<LoginResponseI>;
}
