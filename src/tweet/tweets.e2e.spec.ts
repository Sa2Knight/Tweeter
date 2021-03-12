import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { createConnection, Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { Tweet } from '../entities/tweet.entity'

describe('Users', () => {
  let app: INestApplication

  // FIXME: ファクトリが別にあると良いのかな
  const createUser = (params?: object) => {
    return User.create({
      name: 'name',
      displayName: 'displayName',
      description: 'description',
      ...params
    }).save()
  }

  beforeAll(async () => {
    // FIXME: 設定とコネクション生成を一元化
    const connection = await createConnection({
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
    Tweet.delete({})
    User.delete({})
  })

  describe('POST /tweets', () => {
    let user: User
    beforeEach(async () => (user = await createUser()))
    const postTweetRequest = (params: object) => request(app.getHttpServer()).post('/tweets').send(params)

    it('userId, text を正しく指定した場合、作成したツイート情報が返ってくる', done => {
      postTweetRequest({ userId: user.id, text: 'こんにちは' })
        .expect(201)
        .expect(res => {
          expect(res.body.text).toBe('こんにちは')
          expect(res.body.user).toMatchObject({ id: user.id, name: user.name })
        })
        .end(done)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
