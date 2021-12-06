import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserI, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    let functionSend;

    try {
      functionSend = await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
          name: user.username,
          url,
        },
      });
  
      console.log(functionSend);
  
    } catch {
      throw new HttpException('Can\'t send this email', HttpStatus.BAD_REQUEST)
    }
  }
}
