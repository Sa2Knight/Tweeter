import { Body, Delete, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { Controller, Get, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserPropertyDto } from './createUserProperty.dto'
import { UpdateUserPropertyDto } from './updateUserProperty.dto'
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
  createUser(@Body() userPropertyDto: CreateUserPropertyDto) {
    return this.usersService.create(userPropertyDto)
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() userPropertyDto: UpdateUserPropertyDto) {
    return this.usersService.update(id, userPropertyDto)
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id).then(() => ({ result: 'success' }))
  }
}
