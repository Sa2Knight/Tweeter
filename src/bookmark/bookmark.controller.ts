import { Request, Controller, Post, UseGuards, UsePipes, ValidationPipe, Body, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { BookmarkService } from './bookmark.service'
import { CreateBookmarkPropertyDto } from './createBookmarkProperty.dto'
import { DeleteBookmarkPropertyDto } from './deleteBookmarkProperty.dto'

@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async createBookmark(@Request() req: any, @Body() dto: CreateBookmarkPropertyDto) {
    return this.bookmarkService.create(req.user, dto.tweetId)
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async deleteBookmark(@Request() req: any, @Body() dto: DeleteBookmarkPropertyDto) {
    return this.bookmarkService.delete(req.user, dto.tweetId)
  }
}
