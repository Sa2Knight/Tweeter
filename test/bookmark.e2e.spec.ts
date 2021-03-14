import { Bookmark } from 'src/entities/bookmark.entity'
import { Tweet } from 'src/entities/tweet.entity'
import { User } from 'src/entities/user.entity'
import { createTweet, createUser, login, test } from './jest.setup'

describe('Bookmark', () => {
  let currentUser: User
  beforeEach(async () => {
    currentUser = await createUser()
    await login(currentUser)
  })

  describe('POST /bookmarks', () => {
    const postBookmarkRequest = (tweet: Tweet) => test('POST', '/bookmarks').send({ tweetId: tweet.id })

    it('201: 存在する他のユーザーのツイートの場合', async done => {
      const tweet = await createTweet({ user: await createUser() })
      postBookmarkRequest(tweet).expect(201, done)
    })

    it('201: 存在する自分のツイートの場合', async done => {
      const tweet = await createTweet({ user: currentUser })
      postBookmarkRequest(tweet).expect(201, done)
    })

    it('404: 存在しないツイートの場合', async done => {
      test('POST', '/bookmarks').send({ tweetId: 0 }).expect(404, done)
    })

    it('400: 既にブックマーク済みのツイートの場合', async done => {
      const tweet = await createTweet({ user: currentUser })
      await Bookmark.create({ user: currentUser, tweet: tweet }).save()
      postBookmarkRequest(tweet).expect(400, done)
    })

    it('400: tweetId を指定しなかった場合', async done => {
      test('POST', '/bookmarks').send({}).expect(400, done)
    })
  })

  describe('DELETE /bookmarks', () => {
    const deleteBookmarkRequest = (tweet: Tweet) => test('DELETE', '/bookmarks').send({ tweetId: tweet.id })

    it('200: ブックマーク済みのツイートの場合', async done => {
      const tweet = await createTweet({ user: currentUser })
      await Bookmark.create({ user: currentUser, tweet: tweet }).save()
      deleteBookmarkRequest(tweet).expect(200, done)
    })

    it('404: ブックマークしていないツイートの場合', async done => {
      const tweet = await createTweet({ user: currentUser })
      deleteBookmarkRequest(tweet).expect(404, done)
    })

    it('400: tweetId を指定しなかった場合', async done => {
      test('DELETE', '/bookmarks').send({}).expect(400, done)
    })
  })
})
