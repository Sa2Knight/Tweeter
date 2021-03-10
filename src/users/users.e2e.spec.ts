import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UsersModule } from './users.module'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { createConnection, Repository } from 'typeorm'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { endianness } from 'node:os'

describe('Users', () => {
  let app: INestApplication
  let repository: Repository<User>

  beforeAll(async () => {
    // FIXME: 設定とコネクション生成を一元化
    const connection = await createConnection({
      name: 'test-connection',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'tweeter_test',
      entities: [User],
      synchronize: true
    })
    repository = connection.getRepository(User)

    app = await NestFactory.create(AppModule)
    await app.init()
  })

  beforeEach(async () => {
    repository.clear()
  })

  describe('GET /users/:id', () => {
    it('存在するユーザーの場合、ユーザー情報が取得できる', async () => {
      const userObject = { name: 'sasaki', displayName: '笹木', description: '自己紹介' }
      const savedUser = await repository.save(new User(userObject))

      request(app.getHttpServer())
        .get(`/users/${savedUser.id}`)
        .expect(200)
        .expect(res => expect(res.body).toMatchObject(userObject))
    })

    it('存在しないユーザーの場合、404 エラーが返ってくる', done => {
      request(app.getHttpServer()).get('/users/1').expect(404, done)
    })
  })

  describe('POST /users', () => {
    it('name, displayName, description を正しく指定した場合、作成したユーザーが返ってくる', done => {
      const params = { name: 'sasaki', displayName: '笹木', description: '自己紹介' }
      request(app.getHttpServer())
        .post('/users')
        .send(params)
        .expect(201)
        .expect(res => expect(res.body).toMatchObject(params))
        .end(done)
    })

    it('description を省略した場合、 description が空でユーザーが作成される', done => {
      request(app.getHttpServer())
        .post('/users')
        .send({ name: 'sasaki', displayName: '笹木' })
        .expect(201)
        .expect(res => expect(res.body).toMatchObject({ description: '' }))
        .end(done)
    })

    it('name を省略した場合、404 エラーが返ってくる', done => {
      request(app.getHttpServer())
        .post('/users')
        .send({ displayName: '笹木', description: '自己紹介' })
        .expect(400, done)
    })

    it('displayName を省略した場合、400 エラーが返ってくる', done => {
      request(app.getHttpServer())
        .post('/users')
        .send({ name: 'sasaki', description: '自己紹介' })
        .expect(400, done)
    })

    describe('既存ユーザーがいる場合', () => {
      beforeEach(async () => {
        await repository.save(new User({ name: 'sasaki', displayName: '笹木', description: '自己紹介' }))
      })
      it('name が重複してる場合、 400 エラーが返ってくる', done => {
        request(app.getHttpServer())
          .post('/users')
          .send({ name: 'sasaki', displayName: '笹木', description: '自己紹介' })
          .expect(400, done)
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
