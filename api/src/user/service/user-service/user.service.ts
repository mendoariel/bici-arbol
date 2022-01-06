import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { format } from 'prettier';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { MailService } from '../../../mail/services/mail.service';


@Injectable()
export class UserService {
    //nodemailer = require('nodemailer');
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService,
        private mailService: MailService
    ) { }

    async create(newUser: UserI): Promise<UserI> {
        try {
            const exist = await this.mailExists(newUser.email);

            if(!exist) {
                const passwordHash = await this.hashPassword(newUser.password);
                newUser.password = passwordHash;
                const user = await this.userRepository.save(this.userRepository.create(newUser));
                return this.findeOne(user.id);
            } else {
                throw new HttpException('Email is already in use', HttpStatus.CONFLICT)
            }
        } catch {
            throw new HttpException('Email is already in use', HttpStatus.CONFLICT)
        }
    }

    async findAll(options: IPaginationOptions): Promise<Pagination<UserI>> {
        return paginate<UserEntity>(this.userRepository, options)
    }

    async login(user: UserI):Promise<string> {
        try {
            const foundUser: UserI = await this.findByEmail(user.email.toLocaleLowerCase());
            if(foundUser) {
                const matches = this.validatePassword(user.password, foundUser.password);
                if(matches) {
                    const payload: UserI = await this.findeOne(foundUser.id);
                    return this.authService.generateJwt(payload);
                } else {
                    throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED)
                }

            } else {
                throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED)
            }

        } catch {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
    }

    async passwordRecovery(user: UserI): Promise<string> {
        try {
            const foundUser: UserI = await this.findByEmail(user.email.toLocaleLowerCase());
            if(foundUser) {
                return this.sendEmailRecoryPass(foundUser);
                
            } else {
                throw new HttpException('Usuario sin registro', HttpStatus.UNAUTHORIZED)
            }
        } catch {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

    }

    async sendEmailRecoryPass(user) {
        let date = new Date();
        let key = this.generateString(233);

        user.recoveryPasswordToken = key;
        user.passTokenExpire = date.toString();
        this.userRepository.update(user.id, user);

        

        try {
            await this.mailService.sendUserConfirmation(user, key);
            return `Se ha enviado una email, con las intrucciones para recuperar tu cuenta a ${user.email}`;
        } catch {
            throw new HttpException('Can\'t send this email', HttpStatus.BAD_REQUEST)
        }
    }

    generateString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({ email }, { select: ['id', 'email', 'username', 'password'] })
    }

    private async findeOne(id: number): Promise<UserI> {
        return this.userRepository.findOne({ id })
    }

    public getOne(id: number): Promise<UserI> {
        return this.userRepository.findOneOrFail({ id })
    }

    private async mailExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({email});
        console.log('into user service mailExists ', user);
        if(user) {
            return true
        } else {
            return false
        }
    }

    private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
        return this.authService.passwordCompare(password, storedPasswordHash)
    }

    private async hashPassword(password: string): Promise<string> {
        return this.authService.hasPassword(password)
    }

    async newPassword(token: string, id: number, newPassword: string): Promise<string> {
        try {
            const user: UserI = await this.userRepository.findOne({id}, {select: ['id', 'username', 'email', 'password','recoveryPasswordToken', 'passTokenExpire']});
            console.log('user.recoveryPasswordToken ===> ', user.recoveryPasswordToken);
            console.log('token from frontend ===> ', token);
            if(user.recoveryPasswordToken === token) {
                console.log('the token match');
                user.recoveryPasswordToken = '';
                user.passTokenExpire = '';
                user.password = newPassword;
                await this.userRepository.update(user.id, user);

            } else {
                throw new HttpException('Problem, not match key', HttpStatus.NOT_FOUND)
            }
            
        } catch {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        
        return 'Password changed'
    }


}
