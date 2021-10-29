import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserI } from 'src/user/model/user.interface';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateJwt(user: UserI): Observable<string>;
    hasPassword(password: string): Observable<string>;
    passwordCompare(password: string, storedPasswordHash: string): Observable<any>;
    verifyJwt(jwt: string): Promise<any>;
}
