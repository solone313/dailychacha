import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserRepository } from './auth/user.repository';
import { ormConfig } from './config/orm.config';
import { TypeOrmExModule } from './db/typeorm-ex.decorator';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: ormConfig}),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
