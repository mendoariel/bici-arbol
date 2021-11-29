import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { MailService } from '../../../mail/services/mail.service';
export declare class UserService {
    private readonly userRepository;
    private authService;
    private mailService;
    constructor(userRepository: Repository<UserEntity>, authService: AuthService, mailService: MailService);
    create(newUser: UserI): Promise<UserI>;
    findAll(options: IPaginationOptions): Promise<Pagination<UserI>>;
    login(user: UserI): Promise<string>;
    passwordRecovery(user: UserI): Promise<UserI>;
    generateString(length: any): string;
    findByEmail(email: string): Promise<UserEntity>;
    private findeOne;
    getOne(id: number): Promise<UserI>;
    private mailExists;
    private validatePassword;
    private hashPassword;
}
