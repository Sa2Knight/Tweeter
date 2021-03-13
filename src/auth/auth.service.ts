import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {} // 注入される予定の User サービス

  async validateUser(name: string, password: string) {
    const user = await this.usersService.findByName(name)
    if (user && user.password === password) {
      const { password, ...result } = user
      return result
    }
    return null
  }
}
