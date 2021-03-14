import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { DeleteResult } from 'typeorm'
import { Followings } from '../entities/followings.entity'
import { User } from '../entities/user.entity'

@Injectable()
export class FollowingsService {
  async create(fromUser: User, toUserId: number): Promise<Followings> {
    const toUser = await this.findUser(toUserId)
    if (fromUser.id === toUserId) throw new BadRequestException('Can not follow myself')

    return Followings.create({ fromUser, toUser })
      .save()
      .catch(e => {
        throw new BadRequestException('Failed to create following')
      })
  }

  async delete(fromUser: User, toUserId: number): Promise<DeleteResult> {
    const toUser = await this.findUser(toUserId)
    return Followings.delete({ fromUser, toUser })
  }

  private async findUser(id: number): Promise<User> {
    return User.findOneOrFail(id).catch(e => {
      throw new NotFoundException('User not found')
    })
  }
}
