import { INestApplication } from '@nestjs/common'
import { Tweet } from '../src/entities/tweet.entity'
import { User } from '../src/entities/user.entity'
import { Connection, createConnection, Repository } from 'typeorm'
import { AppModule } from '../src/app.module'
import { NestFactory } from '@nestjs/core'
import supertest, * as request from 'supertest'
import { access } from 'node:fs'

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
  app = await NestFactory.create(AppModule, { logger: false })
  await app.init()
})

beforeEach(async () => {
  logout()
  await Tweet.delete({})
  await User.delete({})
})

afterAll(async () => {
  if (app) await app.close()
  if (dbConnection) await dbConnection.close()
})

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'
let accessToken: string | null

export const req = () => request(app.getHttpServer())
export const test = (method: Method, url: string) => {
  switch (method) {
    case 'GET':
      return req().get(url).set('Authorization', `Bearer ${accessToken}`)
    case 'POST':
      return req().post(url).set('Authorization', `Bearer ${accessToken}`)
    case 'PATCH':
      return req().patch(url).set('Authorization', `Bearer ${accessToken}`)
    case 'DELETE':
      return req().delete(url).set('Authorization', `Bearer ${accessToken}`)
  }
}
export const logout = () => (accessToken = null)
export const login = async (user: User) => {
  const res = await test('POST', '/login').send({ username: user.name, password: user.password })
  accessToken = res.body.access_token
}

export const createUser = (params?: object) => {
  return User.create({
    name: `name_${Math.random()}`,
    displayName: `displayName_${Math.random}`,
    description: `description_${Math.random()}`,
    ...params
  }).save()
}

export const createTweet = async (params: any = {}) => {
  return Tweet.create({
    user: params.user || (await createUser()),
    text: params.text || `text_${Math.random()}`
  }).save()
}
