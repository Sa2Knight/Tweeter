import { Retweet } from 'src/entities/retweet.entity'
import { Tweet } from 'src/entities/tweet.entity'
import { User } from 'src/entities/user.entity'
import { createTweet, createUser, login, test } from './jest.setup'

describe('Retweet', () => {
  let currentUser: User
  beforeEach(async () => {
    currentUser = await createUser()
    await login(currentUser)
  })

  describe('POST /retweets', () => {
    const postRetweetRequest = (tweet: Tweet) => test('POST', '/retweets').send({ tweetId: tweet.id })

    it('201: 存在する他のユーザーのツイートの場合', async done => {
      const tweet = await createTweet({ user: await createUser() })
      postRetweetRequest(tweet).expect(201, done)
    })

    it('201: 存在する自分のツイートの場合', async done => {
      const tweet = await createTweet({ user: currentUser })
      postRetweetRequest(tweet).expect(201, done)
    })

    it('404: 存在しないツイートの場合', async done => {
      test('POST', '/retweets')
        .send({ tweetId: 0 })
        .expect(404)
        .expect(res => expect(res.body).toMatchObject({ message: 'Tweet not found' }))
        .end(done)
    })

    it('400: 既にリツイート済みのツイートの場合', async done => {
      const tweet = await createTweet({ user: currentUser })
      await Retweet.create({ user: currentUser, tweet: tweet }).save()
      postRetweetRequest(tweet).expect(400, done)
    })

    it('400: tweetId を指定しなかった場合', async done => {
      test('POST', '/retweets').send({}).expect(400, done)
    })
  })

  describe('DELETE /retweets', () => {
    const deleteRetweetRequest = (tweet: Tweet) => test('DELETE', '/retweets').send({ tweetId: tweet.id })

    it('200: リツイート済みのツイートの場合', async done => {
      const tweet = await createTweet({ user: currentUser })
      await Retweet.create({ user: currentUser, tweet: tweet }).save()
      deleteRetweetRequest(tweet).expect(200, done)
    })

    it('404: リツイートしていないツイートの場合', async done => {
      const tweet = await createTweet({ user: currentUser })
      deleteRetweetRequest(tweet)
        .expect(404)
        .expect(res => expect(res.body).toMatchObject({ message: 'Retweet not found' }))
        .end(done)
    })

    it('400: tweetId を指定しなかった場合', async done => {
      test('DELETE', '/retweets').send({}).expect(400, done)
    })
  })
})
