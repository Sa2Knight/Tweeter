import { Tweet } from 'src/entities/tweet.entity'
import { test, createTweet, createUser, login } from 'test/jest.setup'

describe('Tweets', () => {
  describe('POST /tweets', () => {
    it('userId, text を正しく指定した場合、作成したツイート情報が返ってくる', async done => {
      const currentUser = await createUser()
      await login(currentUser)

      test('POST', '/tweets')
        .send({ text: 'こんにちは' })
        .expect(201)
        .expect(res => {
          expect(res.body.text).toBe('こんにちは')
          expect(res.body.user).toMatchObject({ id: currentUser.id, name: currentUser.name })
        })
        .end(done)
    })
  })

  it('text を省略した場合、 400 エラーが返ってくる', async done => {
    const currentUser = await createUser()
    await login(currentUser)
    test('POST', '/tweets').expect(400).end(done)
  })
})

describe('DELETE /tweets/:id', () => {
  let targetTweet: Tweet

  beforeEach(async () => {
    targetTweet = await createTweet()
  })

  it('ログイン中ユーザーのツイートの場合、200が返ってくる', async done => {
    await login(targetTweet.user)
    test('DELETE', `/tweets/${targetTweet.id}`).expect(200, done)
  })

  it('ログイン中ユーザーのツイートでない場合、404 エラーが返ってくる', async done => {
    await login(await createUser())
    test('DELETE', `/tweets/0`).expect(404, done)
  })
})
