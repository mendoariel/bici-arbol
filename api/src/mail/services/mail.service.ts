import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserI, token: string) {
    const url = process.env.FRONTEND + `/public/new-password?token=${token}&userid=${user.id}`;

    let functionSend;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Soliciutd de cambio de contraseña para bici arbol',
        template: './password-recovery', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
          name: user.username,
          url,
        },
      });
  
    } catch {
      throw new HttpException('Can\'t send this email', HttpStatus.BAD_REQUEST)
    }
  }
}
