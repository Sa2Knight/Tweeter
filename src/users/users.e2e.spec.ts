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
    User.delete({})
  })

  describe('GET /users/:id', () => {
    const getUserRequest = (id: number) => request(app.getHttpServer()).get(`/users/${id}`)

    it('存在するユーザーの場合、ユーザー情報が取得できる', async done => {
      const user = await createUser()
      getUserRequest(user.id)
        .expect(200)
        .expect(res => expect(res.body).toMatchObject({ id: user.id, name: user.name }))
        .end(done)
    })

    it('存在しないユーザーの場合、404 エラーが返ってくる', done => {
      getUserRequest(1).expect(404, done)
    })
  })

  describe('POST /users', () => {
    const postUserRequest = (params: object) => request(app.getHttpServer()).post('/users').send(params)

    it('name, displayName, description を正しく指定した場合、作成したユーザーが返ってくる', done => {
      const params = { name: 'sasaki', displayName: '笹木', description: '自己紹介' }
      postUserRequest(params)
        .expect(201)
        .expect(res => expect(res.body).toMatchObject(params))
        .end(done)
    })

    it('description を省略した場合、 description が空でユーザーが作成される', done => {
      postUserRequest({ name: 'sasaki', displayName: '笹木' })
        .expect(201)
        .expect(res => expect(res.body).toMatchObject({ description: '' }))
        .end(done)
    })

    it('name を省略した場合、404 エラーが返ってくる', done => {
      postUserRequest({ displayName: '笹木', description: '自己紹介' }).expect(400, done)
    })

    it('displayName を省略した場合、400 エラーが返ってくる', done => {
      postUserRequest({ name: 'sasaki', description: '自己紹介' }).expect(400, done)
    })

    describe('既存ユーザーがいる場合', () => {
      it('name が重複してる場合、 400 エラーが返ってくる', async done => {
        const user = await createUser()
        postUserRequest({ name: user.name, displayName: '笹木', description: '自己紹介' }).expect(400, done)
      })
    })
  })

  describe('PATCH /users/:id', () => {
    const patchUserRequest = (id: number, params: object) => {
      return request(app.getHttpServer()).patch(`/users/${id}`).send(params)
    }
    let user: User
    beforeEach(async () => (user = await createUser()))

    it('displayName を指定することでユーザー情報を更新できる', done => {
      patchUserRequest(user.id, { displayName: 'newDisplayName' })
        .expect(200)
        .expect(res => expect(res.body).toMatchObject({ displayName: 'newDisplayName' }))
        .end(done)
    })

    it('description を指定することでユーザー情報を更新できる', done => {
      patchUserRequest(user.id, { description: 'newDescription' })
        .expect(200)
        .expect(res => expect(res.body).toMatchObject({ description: 'newDescription' }))
        .end(done)
    })

    it('name を変更しようとすると、200 は返ってくるが変更が反映されていない', done => {
      patchUserRequest(user.id, { name: 'newName' })
        .expect(200)
        .expect(res => expect(res.body).not.toMatchObject({ name: 'newName' }))
        .end(done)
    })
    it('存在しないユーザーの場合、404 エラーが返ってくる', done => {
      patchUserRequest(0, { name: 'newName' }).expect(404, done)
    })
  })

  describe('DELETE /users/:id', () => {
    const deleteUserRequest = (id: number) => {
      return request(app.getHttpServer()).delete(`/users/${id}`)
    }
    let user: User
    beforeEach(async () => (user = await createUser()))

    it('存在するユーザーの場合、200が返ってくる', async done => {
      deleteUserRequest(user.id).expect(200, done)
    })
    it('存在しないユーザーの場合、404 エラーが返ってくる', done => {
      deleteUserRequest(0).expect(404, done)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
