import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, ObservedValueOf } from 'rxjs';
import { UserI } from 'src/user/model/user.interface';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService){}

    async generateJwt(user: UserI):Promise<string> {
        return this.jwtService.signAsync({user})
    } 
    
    async hasPassword(password: string):Promise<string> {
        return (bcrypt.hash(password, 12))
    }

    async passwordCompare(password: string, storedPasswordHash: string):Promise<any> {
        return bcrypt.compare(password, storedPasswordHash);
    }

    verifyJwt(jwt: string):Promise<any> {
        return  this.jwtService.verifyAsync(jwt)
    }
}
