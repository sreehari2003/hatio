import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

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

  async login(user) {
    try {
      const token = await this.generateAuthToken(user.id);
      return token;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      }
    }
  }

  async generateAuthToken(uid: string) {
    const payload = {
      iss: this.configService.get('API_BASE_URL'),
      sub: uid,
      iat: new Date().getTime(),
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.generateRefreshToken(uid);

    return {
      accessToken,
      refreshToken,
    };
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

  async refreshAuthToken(user: User, hashedToken: string) {
    if (!user) throw new Error('USER_NOT_FOUND');

    const isRefreshTokenValid = await bcrypt.compare(
      user.refreshToken,
      hashedToken,
    );

    if (!isRefreshTokenValid)
      throw new Error('AFTER_GENERATION_INVALID_REFRESH_TOKEN');

    return await this.generateAuthToken(user.id);
  }
}
