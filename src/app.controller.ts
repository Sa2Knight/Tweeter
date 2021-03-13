import { AppService } from './app.service'
import { Request, Controller, Post, UseGuards, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth/auth.service'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user)
  }
}
