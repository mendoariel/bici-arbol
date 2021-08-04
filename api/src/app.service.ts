import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Object {
    return {title: 'Hello Puala I want to meet you! and your best friend to again'};
  }
}
