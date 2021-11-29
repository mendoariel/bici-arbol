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

    async passwordRecovery(user: UserI) {
        let foundUser: UserI;
        
        await this.findByEmail(user.email).then(res => {
            console.log('into user service password recovery method ====> ', res);
            foundUser = res;
        });

        return foundUser;

        // let token;
        // let date;
        // if (foundUser  !== null) {
        //     // send email to foundUser email
        //     // let tokenToRecover;
        //     token = this.generateString(100);
        //     date = new Date();
        //     foundUser.recoveryPasswordToken = token;
        //     foundUser.passTokenExpire = date.toString();
        //     this.userRepository.update(foundUser.id, foundUser);

        // } else {
        //     throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        // }

        // this.findByEmail(user.email).pipe(
        //     switchMap((foundUser: UserI) => {
        //         let token;
        //         let date;
        //         if (foundUser) {
        //             // send email to foundUser email
        //             // let tokenToRecover;
        //             token = this.generateString(100);
        //             date = new Date();
        //             foundUser.recoveryPasswordToken = token;
        //             foundUser.passTokenExpire = date.toString();
        //             this.userRepository.update(foundUser.id, foundUser);

        //         } else {
        //             throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        //         }
        //         await this.mailService.sendUserConfirmation(foundUser, token).catch(err => console.log(err));
        //     })
        // )

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
        const user = this.userRepository.findOne({email});
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


}
