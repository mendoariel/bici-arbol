 import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './', '../../frontend/dist/frontend/'),
    }),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.host,
      port: parseInt(process.env.port),
      username: process.env.username,
      password: process.env.password,
      database: process.env.db,
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    AuthModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {path: '/api/users', method: RequestMethod.POST},
        {path: '/api/users/login', method: RequestMethod.POST}
      )
      .forRoutes('')
  }
}
