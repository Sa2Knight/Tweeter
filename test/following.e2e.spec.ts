import { Followings } from '../src/entities/followings.entity'
import { User } from '../src/entities/user.entity'
import { createUser, login, test } from './jest.setup'

describe('Followings', () => {
  describe('POST /followings', () => {
    const postFollowingRequest = (user: User) => test('POST', '/followings').send({ userId: user.id })

    it('200: フォローしていない自分以外のユーザーを指定した場合', async done => {
      await login(await createUser())

      postFollowingRequest(await createUser()).expect(200, done)
    })

    it('400: フォロー済みの自分以外のユーザーを指定した場合', async done => {
      const currentUser = await createUser()
      const targetUser = await createUser()
      await login(currentUser)
      const f = await Followings.create({ fromUser: currentUser, toUser: targetUser }).save()

      console.log(f)
      postFollowingRequest(await createUser()).expect(400, done)
    })

    it('400: 自分自身を指定した場合', async done => {
      const currentUser = await createUser()
      await login(currentUser)

      postFollowingRequest(currentUser).expect(400, done)
    })

    it('400: ユーザーを指定しなかった場合', async done => {
      expect(true).toEqual(false)
      done()
    })
  })
})
