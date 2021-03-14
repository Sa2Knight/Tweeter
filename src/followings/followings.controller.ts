import { Body, Controller, Post, Delete, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateFollowingPropertyDto } from './createFollowingProperty.dto'
import { DeleteFollowingPropertyDto } from './deleteFollowingProperty.dto'
import { FollowingsService } from './followings.service'

@Controller('followings')
export class FollowingsController {
  constructor(private followingService: FollowingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async createFollowing(@Request() req: any, @Body() dto: CreateFollowingPropertyDto) {
    return this.followingService.create(req.user, dto.userId)
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async deleteFollowing(@Request() req: any, @Body() dto: DeleteFollowingPropertyDto) {
    return this.followingService.delete(req.user, dto.userId).then(_ => ({ result: 'success' }))
  }
}
