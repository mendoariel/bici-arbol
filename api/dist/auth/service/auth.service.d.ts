import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/model/user.interface';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateJwt(user: UserI): Promise<string>;
    hasPassword(password: string): Promise<string>;
    passwordCompare(password: string, storedPasswordHash: string): Promise<any>;
    verifyJwt(jwt: string): Promise<any>;
}
