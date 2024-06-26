import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Response,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth-guard';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/register-dto';
import { cookieHandler } from './cookieHandler';
import { RefreshGuard } from './guard/refresh-guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './decorator/user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const tokens = await this.authService.login(req.user);
    cookieHandler(res, tokens, false);
  }

  @Post('register')
  async register(@Body() data: CreateUserDto, @Response() res) {
    const user = await this.userService.createUser(data.email, data.password);
    await this.authService.generateRefreshToken(user.user);

    const tokens = await this.authService.login({
      id: user.user,
    });
    cookieHandler(res, tokens, false);
  }

  @Get('/refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Request() req, @Response() res) {
    const genToken = await this.authService.refreshAuthToken(
      req.user,
      req.cookies['refresh_token'],
    );

    cookieHandler(res, genToken, false);
  }

  @Get('/user')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@AuthUser() user: User) {
    return await this.userService.getUserInfo(user.id);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logOut(@Response() res) {
    cookieHandler(
      res,
      {
        accessToken: null,
        refreshToken: null,
      },
      false,
    );
  }
}
