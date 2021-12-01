"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const auth_service_1 = require("../../../auth/service/auth.service");
const user_entity_1 = require("../../model/user.entity");
const user_interface_1 = require("../../model/user.interface");
const typeorm_2 = require("typeorm");
const mail_service_1 = require("../../../mail/services/mail.service");
let UserService = class UserService {
    constructor(userRepository, authService, mailService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.mailService = mailService;
    }
    async create(newUser) {
        try {
            const exist = await this.mailExists(newUser.email);
            if (!exist) {
                const passwordHash = await this.hashPassword(newUser.password);
                newUser.password = passwordHash;
                const user = await this.userRepository.save(this.userRepository.create(newUser));
                return this.findeOne(user.id);
            }
            else {
                throw new common_1.HttpException('Email is already in use', common_1.HttpStatus.CONFLICT);
            }
        }
        catch (_a) {
            throw new common_1.HttpException('Email is already in use', common_1.HttpStatus.CONFLICT);
        }
    }
    async findAll(options) {
        return nestjs_typeorm_paginate_1.paginate(this.userRepository, options);
    }
    async login(user) {
        try {
            const foundUser = await this.findByEmail(user.email.toLocaleLowerCase());
            console.log('into login service foundUser ', foundUser);
            if (foundUser) {
                const matches = this.validatePassword(user.password, foundUser.password);
                if (matches) {
                    const payload = await this.findeOne(foundUser.id);
                    return this.authService.generateJwt(payload);
                }
                else {
                    throw new common_1.HttpException('Login was not successfull, wrong credentials', common_1.HttpStatus.UNAUTHORIZED);
                }
            }
            else {
                throw new common_1.HttpException('Login was not successfull, wrong credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        catch (_a) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async passwordRecovery(user) {
        let foundUser;
        await this.findByEmail(user.email).then(res => {
            console.log('into user service password recovery method ====> ', res);
            foundUser = res;
        });
        return foundUser;
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
    async findByEmail(email) {
        return this.userRepository.findOne({ email }, { select: ['id', 'email', 'username', 'password'] });
    }
    async findeOne(id) {
        return this.userRepository.findOne({ id });
    }
    getOne(id) {
        return this.userRepository.findOneOrFail({ id });
    }
    async mailExists(email) {
        const user = await this.userRepository.findOne({ email });
        console.log('into user service mailExists ', user);
        if (user) {
            return true;
        }
        else {
            return false;
        }
    }
    async validatePassword(password, storedPasswordHash) {
        return this.authService.passwordCompare(password, storedPasswordHash);
    }
    async hashPassword(password) {
        return this.authService.hasPassword(password);
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService,
        mail_service_1.MailService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map