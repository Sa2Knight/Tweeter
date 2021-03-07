import { Param } from '@nestjs/common'
import { Controller, Get, ParseIntPipe } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id)
  }
}
