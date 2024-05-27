import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategy/email-password';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_VALIDITY },
    }),
    PrismaModule,
  ],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
