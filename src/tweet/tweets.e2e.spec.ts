import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { createConnection, Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { Tweet } from '../entities/tweet.entity'

describe('Tweets', () => {
  let app: INestApplication

  // FIXME: ファクトリが別にあると良いのかな
  const createUser = async (params?: object) => {
    return User.create({
      name: `name_${Math.random()}`,
      displayName: `displayName_${Math.random}`,
      description: `description_${Math.random()}`,
      ...params
    }).save()
  }

  const createTweet = async (params?: object) => {
    return Tweet.create({
      user: await createUser(),
      text: `text_${Math.random()}`,
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
    await Tweet.delete({})
    await User.delete({})
  })

  describe('POST /tweets', () => {
    const postTweetRequest = (params: object) => request(app.getHttpServer()).post('/tweets').send(params)

    it('userId, text を正しく指定した場合、作成したツイート情報が返ってくる', async done => {
      const tweetUser = await createUser()

      postTweetRequest({ userId: tweetUser.id, text: 'こんにちは' })
        .expect(201)
        .expect(res => {
          expect(res.body.text).toBe('こんにちは')
          expect(res.body.user).toMatchObject({ id: tweetUser.id, name: tweetUser.name })
        })
        .end(done)
    })

    it('userId に存在しないユーザーを指定した場合、 404 エラーが返ってくる', done => {
      postTweetRequest({ userId: 0, text: 'こんにちは' }).expect(404, done)
    })

    it('text を省略した場合、 400 エラーが返ってくる', async done => {
      const tweetUser = await createUser()
      postTweetRequest({ userId: tweetUser.id }).expect(400, done)
    })
  })

  describe('DELETE /tweets/:id', () => {
    const deleteTweetRequest = (id: number) => request(app.getHttpServer()).delete(`/tweets/${id}`)

    it('存在するツイートの場合、200が返ってくる', async done => {
      const tweet = await createTweet()
      deleteTweetRequest(tweet.id).expect(200, done)
    })

    it('存在しないツイートの場合、404 エラーが返ってくる', done => {
      deleteTweetRequest(0).expect(404, done)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
