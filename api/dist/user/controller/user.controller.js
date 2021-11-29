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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("../model/dto/create-user.dto");
const login_user_dto_1 = require("../model/dto/login-user.dto");
const user_helper_service_1 = require("../service/user-helper/user-helper.service");
const user_service_1 = require("../service/user-service/user.service");
let UserController = class UserController {
    constructor(userService, userHelperService) {
        this.userService = userService;
        this.userHelperService = userHelperService;
    }
    async create(createUserDto) {
        const userEntity = this.userHelperService.createUserDtoEntity(createUserDto);
        return this.userService.create(userEntity);
    }
    async findAll(page = 1, limit = 10) {
        limit = limit > 100 ? 100 : limit;
        return this.userService.findAll({ page, limit, route: 'http://localhost:3000/api/users' });
    }
    async login(loginUserDto) {
        const userEntity = await this.userHelperService.loginUserDto(loginUserDto);
        const jwt = await this.userService.login(userEntity);
        return {
            access_token: jwt,
            token_type: 'JWT',
            expires_in: 10000
        };
    }
    async passwordRecovery(user) {
        let userResponse;
        const userF = this.userService.passwordRecovery(user);
        await userF.then(res => {
            userResponse = res;
            console.log('from user controller ======> ', userResponse);
        });
        return userResponse;
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('page')),
    __param(1, common_1.Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    common_1.Post('password-recovery'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "passwordRecovery", null);
UserController = __decorate([
    common_1.Controller('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        user_helper_service_1.UserHelperService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map