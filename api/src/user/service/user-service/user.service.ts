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

    create(newUser: UserI): Observable<UserI> {
        console.log('into create user service');
        console.log(newUser);
        return this.mailExists(newUser.email).pipe(
            switchMap((exists: boolean) => {
                if (!exists) {
                    return this.hashPassword(newUser.password).pipe(
                        switchMap((passwordHash: string) => {
                            newUser.password = passwordHash;
                            return from(this.userRepository.save(newUser)).pipe(
                                switchMap((user: UserI) => this.findeOne(user.id))
                            );
                        })
                    )
                } else {
                    throw new HttpException('Email is already in use', HttpStatus.CONFLICT)
                }
            })
        )
    }

    findAll(options: IPaginationOptions): Observable<Pagination<UserI>> {
        return from(paginate<UserEntity>(this.userRepository, options))
    }

    // login(user: UserI): Observable<string> {
    //     return this.findByEmail(user.email).pipe(
    //         switchMap((foundUser: UserI) => {
    //             if (foundUser) {
    //                 return this.validatePassword(user.password, foundUser.password).pipe(
    //                     switchMap((matches: boolean) => {
    //                         if (matches) {
    //                             return this.findeOne(foundUser.id).pipe(
    //                                 switchMap((payload: UserI) => this.authService.generateJwt(payload))
    //                             )
    //                         } else {
    //                             throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED)
    //                         }

    //                     })
    //                 )
    //             } else {
    //                 throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    //             }
    //         })
    //     )
    // }

    async passwordRecovery(user: UserI) {
        let foundUser: UserI;
        
        return this.findByEmail(user.email);

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



    // declare all characters


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

    private findeOne(id: number): Observable<UserI> {
        return from(this.userRepository.findOne({ id }))
    }

    public getOne(id: number): Promise<UserI> {
        return this.userRepository.findOneOrFail({ id })
    }

    private mailExists(email: string): Observable<boolean> {
        return from(this.userRepository.findOne({ email })).pipe(
            map((user: UserI) => {
                if (user) {
                    return true
                } else return false;
            })
        )
    }

    private validatePassword(password: string, storedPasswordHash: string): Observable<any> {
        return this.authService.passwordCompare(password, storedPasswordHash)
    }

    private hashPassword(password: string): Observable<string> {
        return this.authService.hasPassword(password)
    }


}
