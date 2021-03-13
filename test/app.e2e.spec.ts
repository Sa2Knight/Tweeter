import { test, createUser } from './jest.setup'

describe('App', () => {
  describe('POST /login', () => {
    const postLoginRequest = (userName: string, password: string) => {
      return test().post('/login').send({ username: userName, password })
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
})
