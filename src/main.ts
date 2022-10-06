import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'src/util/swagger';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'production' ) ? '.production.env'
    : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
  )
});

console.log('db_host : ', process.env.DB_HOST);
console.log('db_username : ', process.env.DB_USER);
console.log('db_password : ', process.env.DB_PASS);
console.log('db_name : ', process.env.DB_NAME);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  
  await app.listen(3000);
}
bootstrap();
