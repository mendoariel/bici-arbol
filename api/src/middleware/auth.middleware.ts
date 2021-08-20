import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/auth/service/auth.service";
import { UserI } from "src/user/model/user.interface";
import { UserService } from "src/user/service/user-service/user.service";

export interface RequestModel extends Request {
    user: UserI;
}


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService, private userSerice: UserService ) {}

    async use(req: RequestModel , res: Response, next: NextFunction) {
        try {

            const tokenArray: string[] = req.headers['authorization'].split(' ');
            const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
            
            // Make user that the user is no deleted, or that props or rights changed compared ot the time when the jwt  was issued
            const user: UserI = await this.userSerice.getOne(decodedToken.user.id);
            if(user) {
                // add the user to our req object, so that we can access it later when we need it
                // if it would be here, we would like overwrite 
                req.user = user;
                next();
            } else {
                throw new HttpException('Unauthorize', HttpStatus.UNAUTHORIZED)    
            }
        } catch {
             throw new HttpException('Unauthorize', HttpStatus.UNAUTHORIZED)
        }
    }
}