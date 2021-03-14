import { Request, Controller, Post, UseGuards, UsePipes, ValidationPipe, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { BookmarkService } from './bookmark.service'
import { CreateBookmarkPropertyDto } from './createBookmarkProperty.dto'
import { DeleteBookmarkPropertyDto } from './deleteBookmarkProperty.dto'

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async createBookmark(@Request() req: any, @Body() dto: CreateBookmarkPropertyDto) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async deleteBookmark(@Request() req: any, @Body() dto: DeleteBookmarkPropertyDto) {}
}
