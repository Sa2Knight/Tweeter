import {
  Body,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request
} from '@nestjs/common'
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

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  updateUser(@Request() req: any, @Body() userPropertyDto: UpdateUserPropertyDto) {
    return this.usersService.update(req.user.id, userPropertyDto)
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@Request() req: any) {
    return this.usersService.delete(req.user.id).then(() => ({ result: 'success' }))
  }
}
