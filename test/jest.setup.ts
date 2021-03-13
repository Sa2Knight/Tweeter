import { INestApplication } from '@nestjs/common'
import { Tweet } from '../src/entities/tweet.entity'
import { User } from '../src/entities/user.entity'
import { Connection, createConnection, Repository } from 'typeorm'
import { AppModule } from '../src/app.module'
import { NestFactory } from '@nestjs/core'
import * as request from 'supertest'

let app: INestApplication
let dbConnection: Connection

beforeAll(async () => {
  dbConnection = await createConnection({
    name: 'test-connection',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    database: 'tweeter_test',
    entities: [User, Tweet],
    synchronize: true
  })
  app = await NestFactory.create(AppModule)
  await app.init()
})

beforeEach(async () => {
  await Tweet.delete({})
  await User.delete({})
})

afterAll(async () => {
  if (app) await app.close()
  if (dbConnection) await dbConnection.close()
})

export const test = () => request(app.getHttpServer())

export const createUser = (params?: object) => {
  return User.create({
    name: `name_${Math.random()}`,
    displayName: `displayName_${Math.random}`,
    description: `description_${Math.random()}`,
    ...params
  }).save()
}

export const createTweet = async (params?: object) => {
  return Tweet.create({
    user: await createUser(),
    text: `text_${Math.random()}`,
    ...params
  }).save()
}
