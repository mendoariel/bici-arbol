import { MailerService } from '@nestjs-modules/mailer';
import { UserI } from 'src/user/model/user.interface';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserConfirmation(user: UserI, token: string): Promise<void>;
}
