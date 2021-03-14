import { Request, Controller, Post, UseGuards, UsePipes, ValidationPipe, Body, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RetweetService } from './retweet.service'
import { CreateRetweetPropertyDto } from './createRetweetProperty.dto'
import { DeleteRetweetPropertyDto } from './deleteRetweetProperty.dto'

@Controller('retweets')
export class RetweetController {
  constructor(private retweetService: RetweetService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async createRetweet(@Request() req: any, @Body() dto: CreateRetweetPropertyDto) {
    return this.retweetService.create(req.user, dto.tweetId)
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async deleteRetweet(@Request() req: any, @Body() dto: DeleteRetweetPropertyDto) {
    return this.retweetService.delete(req.user, dto.tweetId)
  }
}
