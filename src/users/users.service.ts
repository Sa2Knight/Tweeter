import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { DeleteResult, Repository } from 'typeorm'
import { CreateUserPropertyDto } from './createUserProperty.dto'
import { UpdateUserPropertyDto } from './updateUserProperty.dto'
import { request } from 'express'

@Injectable()
export class UsersService {
  async findOne(id: number): Promise<User> {
    const user = await User.findOne(id)
    if (user) {
      return user
    } else {
      throw new NotFoundException('user not found')
    }
  }

  async create(userPropertyDto: CreateUserPropertyDto): Promise<User> {
    const newUser = User.create({
      name: userPropertyDto.name,
      password: '1q2w3e4r5t6y',
      displayName: userPropertyDto.displayName,
      description: userPropertyDto.description || ''
    })

    return User.save(newUser).catch(e => {
      throw new BadRequestException('Failed to create user')
    })
  }

  async update(id: number, userPropertyDto: UpdateUserPropertyDto) {
    const user = await this.findOne(id)
    user.displayName = userPropertyDto.displayName || user.displayName
    user.description = userPropertyDto.description || user.description
    return user.save().catch(() => {
      throw new BadRequestException('Failed to update user')
    })
  }

  async delete(id: number): Promise<User> {
    const user = await this.findOne(id)
    return user.remove()
  }
}
