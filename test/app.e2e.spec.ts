import { test, createUser, createTweet } from 'test/jest.setup'

describe('App', () => {
  describe('POST /login', () => {
    const postLoginRequest = (userName: string, password: string) => {
      return test('POST', '/login').send({ username: userName, password })
    }

    it('username, password を正しく指定した場合、JWT が返ってくる', async done => {
      const user = await createUser({ password: 'password' })
      postLoginRequest(user.name, 'password')
        .expect(201)
        .expect(res => expect(res.body).toHaveProperty('access_token'))
        .end(done)
    })

    it('username, password を正しく指定しなかった場合、401 エラーが返ってくる', async done => {
      const user = await createUser({ password: 'password' })
      postLoginRequest(user.name, 'invalid_password').expect(401, done)
    })
  })

  describe('各エンドポイントの認証の必要性チェック', () => {
    describe('認証不要', () => {
      it('GET /users/:id', async done => {
        const user = await createUser()
        test('GET', `/users/${user.id}`).expect(200).end(done)
      })

      it('POST /users/', async done => {
        test('POST', `/users`).send({ name: 'name', displayName: 'displayName' }).expect(201).end(done)
      })
    })

    describe('認証必要', () => {
      it('PATCH /users', done => {
        test('PATCH', '/users').expect(401, done)
      })

      it('DELETE /users', done => {
        test('DELETE', '/users').expect(401, done)
      })

      it('POST /tweets', done => {
        test('POST', '/tweets').expect(401, done)
      })

      it('DELETE /tweets/:id', async done => {
        const tweet = await createTweet()
        test('DELETE', `/tweets/${tweet.id}`).expect(401, done)
      })

      it('POST /followings', async done => {
        const targetUser = await createUser()
        test('POST', '/followings').send({ userId: targetUser.id }).expect(401).end(done)
      })

      it('DELETE /followings', async done => {
        const targetUser = await createUser()
        test('DELETE', '/followings').send({ userId: targetUser.id }).expect(401).end(done)
      })
    })
  })
})
