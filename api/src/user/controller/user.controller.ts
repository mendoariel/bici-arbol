import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Token } from 'nodemailer/lib/xoauth2';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { LoginResponseI } from '../model/login-response.interface';
import { UserI } from '../model/user.interface';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user-service/user.service';

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private userHelperService: UserHelperService
    ){}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {

        const userEntity:UserI = this.userHelperService.createUserDtoEntity(createUserDto);

        return this.userService.create(userEntity);
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ):Promise<Pagination<UserI>> {
        limit = limit > 100 ? 100 : limit;
        return this.userService.findAll({page, limit, route: 'http://localhost:3000/api/users'});
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto):Promise<LoginResponseI> {

        const userEntity:UserI = await this.userHelperService.loginUserDto(loginUserDto);

        console.log('into contrller ', loginUserDto);

        const jwt: string = await this.userService.login(userEntity); 

        return {
                            access_token: jwt,
                            token_type: 'JWT',
                            expires_in: 10000
                }  
    }

    @Post('password-recovery')
    async passwordRecovery(@Body() user: UserI):Promise<any> {
        
        const message = await this.userService.passwordRecovery(user);

        return { message: message };
       
    }

    @Post('new-password')
    async newPassword(@Body() body: any):Promise<any> {
        
        const message = await this.userService.newPassword(body.token, body.userid, body.newPassword);

        return  HttpStatus.OK;
    } 
}
