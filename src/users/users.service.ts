import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id)
    if (user) {
      return user
    } else {
      return Promise.reject('user not found')
    }
  }
}
