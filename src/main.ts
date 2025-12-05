import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended'); // для роботи з складними queries масиви і так далі допомогає на парсити 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
