import { test, createTweet, createUser } from './jest.setup'

describe('Tweets', () => {
  describe('POST /tweets', () => {
    const postTweetRequest = (params: object) => test().post('/tweets').send(params)

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
      postTweetRequest({ userId: 0, text: 'こんにちは' }).expect(404).end(done)
    })

    it('text を省略した場合、 400 エラーが返ってくる', async done => {
      const tweetUser = await createUser()
      postTweetRequest({ userId: tweetUser.id }).expect(400).end(done)
    })
  })

  describe('DELETE /tweets/:id', () => {
    const deleteTweetRequest = (id: number) => test().delete(`/tweets/${id}`)

    it('存在するツイートの場合、200が返ってくる', async done => {
      const tweet = await createTweet()
      deleteTweetRequest(tweet.id).expect(200, done)
    })

    it('存在しないツイートの場合、404 エラーが返ってくる', done => {
      deleteTweetRequest(0).expect(404, done)
    })
  })
})
