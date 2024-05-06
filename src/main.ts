import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
// import { useContainer } from 'typeorm';
// import { ConfigModule } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const option = new DocumentBuilder()
  .setTitle(process.env.APP_NAME)
  .addBearerAuth()
  .setDescription('PT Balcom API Docs')
  .setVersion(process.env.APP_VERSION)
  .build();
  
  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup('swagger', app, document)
  app.enableCors();
  // console.log(join(__dirname, 'template'))
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..','template'));
  app.setViewEngine('hbs')

  app.use(bodyParser.json({limit : '100mb'}))
  app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
  const configService = app.get<ConfigService>(ConfigService);
  const appPort = configService.get<number>('APP_PORT')
  await app.listen(appPort);
  console.log('server listen on '+appPort)
}
bootstrap();
