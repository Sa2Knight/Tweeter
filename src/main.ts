import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

function buildDocument(app: INestApplication) {
  const config = new DocumentBuilder().setTitle('Tweeter API Document').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  buildDocument(app)
  await app.listen(3000)
}

bootstrap()
