import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return await this.userService.validateUser(email, password);
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.userId };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      }
    }
  }

  async generateRefreshToken(uid: string) {
    const payload = {
      sub: uid,
      iss: this.configService.get('API_BASE_URL'),
      iat: new Date().getTime(),
    };
    const refreshToken = await this.jwtService.signAsync(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10); // 10 is the saltRounds, you can adjust this value

    const updatedUser = await this.userService.updateRefreshToken(
      uid,
      hashedRefreshToken,
    );

    if (!updatedUser) throw new Error('REFRESH_TOKEN_NOT_UPDATED');

    return refreshToken;
  }
}
