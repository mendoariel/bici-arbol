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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const user_interface_1 = require("../../user/model/user.interface");
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendUserConfirmation(user, token) {
        const url = process.env.FRONTEND + `/public/new-password?token=${token}&userid=${user.id}`;
        let functionSend;
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Soliciutd de cambio de contraseña para bici arbol',
                template: './password-recovery',
                context: {
                    name: user.username,
                    url,
                },
            });
        }
        catch (_a) {
            throw new common_1.HttpException('Can\'t send this email', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
MailService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map