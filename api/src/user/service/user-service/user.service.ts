import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';  
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Like, Repository } from 'typeorm';




@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ){}

    async create(newUser: UserI):Promise<UserI> {
        try {
            const exist: boolean = await this.mailExists(newUser.email);
            if(!exist) {
                const passwordHash: string = await this.hashPassword(newUser.password);
                newUser.password = passwordHash;
                const user = await this.userRepository.save(this.userRepository.create(newUser));
                return this.findOne(user.id);
            } else {
                throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
            }
        } catch { 
            throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
        }
    }

    async findAll(options: IPaginationOptions):Promise<Pagination<UserI>> {
        return paginate<UserEntity>(this.userRepository, options)
    }

    async findAllByUsername(username: string): Promise<UserI[]> {
        return this.userRepository.find({
            where: {
                username: Like(`%${username.toLowerCase()}%`)
            } 
        })
    }
    
    async login(user: UserI): Promise<string> {
        try {
            const foundUser: UserI = await this.findByEmail(user.email.toLocaleLowerCase());
            if(foundUser) {
                const matches: boolean = await this.validatePassword(user.password, foundUser.password);

                if( matches) {
                    const payload: UserI = await this.findOne(foundUser.id);
                    return this.authService.generateJwt(payload);
                } else {
                    throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
                }

                
            } else {
                throw new HttpException('Login was not successfull, wrong credentials', HttpStatus.UNAUTHORIZED);
            }
        } catch {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    

    private async findByEmail(email: string):Promise<UserI> {
         return this.userRepository.findOne({email}, {select: ['id', 'email', 'username','password']});
    }

    private async findOne(id: number): Promise<UserI> {
        return this.userRepository.findOne({id});
    }

    public getOne(id:number):Promise<UserI> {
        return this.userRepository.findOneOrFail({id})
    }    

    private async mailExists(email: string):Promise<boolean> {
        const user = await this.userRepository.findOne({email});
        if(user) {
            return true
        } else return false;
    }

    private async validatePassword(password: string, storedPasswordHash: string):Promise<any> {
        return this.authService.passwordCompare(password, storedPasswordHash)
   }

   private async hashPassword(password: string): Promise<string> {
    return  this.authService.hasPassword(password)
}

    
}
