import { Followings } from 'src/entities/followings.entity'
import { User } from 'src/entities/user.entity'
import { createUser, login, test } from 'test/jest.setup'

describe('Followings', () => {
  describe('POST /followings', () => {
    const postFollowingRequest = (user: User) => test('POST', '/followings').send({ userId: user.id })

    it('201: フォローしていない自分以外のユーザーを指定した場合', async done => {
      await login(await createUser())

      postFollowingRequest(await createUser())
        .expect(201)
        .end(done)
    })

    it('400: フォロー済みの自分以外のユーザーを指定した場合', async done => {
      const currentUser = await createUser()
      const targetUser = await createUser()
      await login(currentUser)
      const f = await Followings.create({ fromUser: currentUser, toUser: targetUser }).save()

      postFollowingRequest(targetUser).expect(400, done)
    })

    it('400: 自分自身を指定した場合', async done => {
      const currentUser = await createUser()
      await login(currentUser)

      postFollowingRequest(currentUser).expect(400, done)
    })

    it('400: ユーザーを指定しなかった場合', async done => {
      const currentUser = await createUser()
      await login(currentUser)

      test('POST', '/followings').send({}).expect(400, done)
    })

    it('404: 存在しないユーザーを指定した場合', async done => {
      const currentUser = await createUser()
      await login(currentUser)

      test('POST', '/followings').send({ userId: 0 }).expect(404, done)
    })
  })

  describe('DELETE /followings', () => {
    const deleteFollowingRequest = (user: User) => test('DELETE', '/followings').send({ userId: user.id })

    let currentUser: User
    beforeEach(async () => {
      currentUser = await createUser()
      await login(currentUser)
    })

    it('200: フォローしているユーザを指定した場合', async done => {
      const targetUser = await createUser()
      await Followings.create({ fromUser: currentUser, toUser: targetUser }).save()

      deleteFollowingRequest(targetUser).expect(200).end(done)
    })

    it('404: フォローしていないユーザを指定した場合', async done => {
      const targetUser = await createUser()

      deleteFollowingRequest(targetUser).expect(200).end(done)
    })

    it('400: ユーザーを指定しなかった場合', async done => {
      test('DELETE', '/followings').send({}).expect(400).end(done)
    })
  })
})
