import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateUserPropertyDto } from './createUserProperty.dto'
import { UpdateUserPropertyDto } from './updateUserProperty.dto'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id)
    if (user) {
      return user
    } else {
      throw new NotFoundException('user not found')
    }
  }

  async create(userPropertyDto: CreateUserPropertyDto): Promise<User> {
    const newUser = new User({
      name: userPropertyDto.name,
      displayName: userPropertyDto.displayName,
      description: userPropertyDto.description || ''
    })

    return this.usersRepository.save(newUser).catch(e => {
      throw new BadRequestException('Failed to create user')
    })
  }

  async update(id: number, userPropertyDto: UpdateUserPropertyDto): Promise<User> {
    const user = await this.findOne(id)
    user.displayName = userPropertyDto.displayName || user.displayName
    user.description = userPropertyDto.description || user.description

    return this.usersRepository.save(user).catch(e => {
      throw new BadRequestException('Failed to update user')
    })
  }

  async delete(id: number): Promise<DeleteResult> {
    const user = await this.findOne(id)
    return this.usersRepository.delete(user.id)
  }
}
