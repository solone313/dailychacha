import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserRepository } from './auth/user.repository';
import { TypeOrmExModule } from './db/typeorm-ex.decorator';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DB_HOST,
      port: 3306,
      username: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
