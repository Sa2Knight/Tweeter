import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserPropertyDto } from './userProperty.dto'

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
    const newUser = new User()
    newUser.name = userPropertyDto.name
    newUser.displayName = userPropertyDto.displayName
    newUser.description = userPropertyDto.description || ''

    return this.usersRepository.save(newUser).catch(e => {
      throw new BadRequestException()
    })
  }
}
