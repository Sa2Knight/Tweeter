import { Body, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { Controller, Get, ParseIntPipe } from '@nestjs/common'
import { CreateUserPropertyDto } from './userProperty.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() userPropertyDto: CreateUserPropertyDto) {
    // FIXME: ユニーク制約違反時のエラーがイケてないのでベストプラクティスを確認する
    return this.usersService.create(userPropertyDto)
  }
}
