import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { OAuth2Client } from 'google-auth-library';
import { GoogleLoginRequestBody } from './models/GoogleLoginRequestBody';

@Injectable()
export class AuthService {
  private oauthClient: OAuth2Client;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {
    this.oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id ? user.id : '',
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle({
    idToken,
  }: GoogleLoginRequestBody): Promise<UserToken> {
    if (!idToken) throw new HttpException('Invalid Google ID Token', 400);
    const ticket = await this.oauthClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new HttpException('Invalid Google ID Token', 400);
    }

    const { email, name } = payload;

    let user: Partial<User> =
      await this.userService.findByEmailOrReturnNull(email);
    if (user) {
      if (!user.googleAccountLinked || user.googleEmail !== email) {
        throw new HttpException(
          'Account already exists and is not linked to Google',
          400,
        );
      }
    }
    if (!user) {
      user = await this.userService.create({
        email,
        name,
        password: null,
      });
    }

    const jwtPayload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(jwtPayload),
    };
  }

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedError(
      'Email address or password provided is incorrect.',
    );
  }

  async linkAccountWithGoogle(
    userId: string,
    idToken: string,
  ): Promise<UserToken> {
    if (!idToken) throw new HttpException('Invalid Google ID Token', 400);

    const ticket = await this.oauthClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    if (!ticket) {
      throw new HttpException('Invalid Google ID Token', 400);
    }

    const payload = ticket.getPayload();
    if (!payload) {
      throw new HttpException('Invalid Google ID Token', 400);
    }

    const { email } = payload;

    const existingUserWithGoogleEmail =
      await this.userService.findByGoogleEmail(email);
    if (
      existingUserWithGoogleEmail &&
      existingUserWithGoogleEmail.id !== userId
    ) {
      throw new HttpException(
        'This Google account is already linked to another user.',
        400,
      );
    }

    const updatedUser = await this.userService.updateUserLinks(userId, email);

    const jwtPayload: UserPayload = {
      sub: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    };

    return {
      access_token: this.jwtService.sign(jwtPayload),
    };
  }
}
