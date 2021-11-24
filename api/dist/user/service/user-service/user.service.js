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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
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
    create(newUser) {
        console.log('into create user service');
        console.log(newUser);
        return this.mailExists(newUser.email).pipe(operators_1.switchMap((exists) => {
            if (!exists) {
                return this.hashPassword(newUser.password).pipe(operators_1.switchMap((passwordHash) => {
                    newUser.password = passwordHash;
                    return rxjs_1.from(this.userRepository.save(newUser)).pipe(operators_1.switchMap((user) => this.findeOne(user.id)));
                }));
            }
            else {
                throw new common_1.HttpException('Email is already in use', common_1.HttpStatus.CONFLICT);
            }
        }));
    }
    findAll(options) {
        return rxjs_1.from(nestjs_typeorm_paginate_1.paginate(this.userRepository, options));
    }
    async passwordRecovery(user) {
        let foundUser;
        return this.findByEmail(user.email);
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
    findeOne(id) {
        return rxjs_1.from(this.userRepository.findOne({ id }));
    }
    getOne(id) {
        return this.userRepository.findOneOrFail({ id });
    }
    mailExists(email) {
        return rxjs_1.from(this.userRepository.findOne({ email })).pipe(operators_1.map((user) => {
            if (user) {
                return true;
            }
            else
                return false;
        }));
    }
    validatePassword(password, storedPasswordHash) {
        return this.authService.passwordCompare(password, storedPasswordHash);
    }
    hashPassword(password) {
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