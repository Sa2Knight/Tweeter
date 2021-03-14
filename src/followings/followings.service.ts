import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Followings } from '../entities/followings.entity'
import { User } from '../entities/user.entity'

@Injectable()
export class FollowingsService {
  async create(fromUser: User, toUserId: number): Promise<Followings> {
    const toUser = await User.findOneOrFail(toUserId).catch(e => {
      throw new NotFoundException('User not found')
    })
    if (fromUser.id === toUserId) {
      throw new BadRequestException('Can not follow myself')
    }
    return Followings.create({ fromUser, toUser })
      .save()
      .catch(e => {
        throw new BadRequestException('Failed to create following')
      })
  }
}
