import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { sendEmail } from '../lib/utils/sendEmail';

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export function prismaExclude<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new HttpException('User already exists', 400);
    }

    let hashedPassword: string | null = null;

    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: hashedPassword,
      googleAccountLinked: (hashedPassword === null) ? true : false,
      googleEmail: (hashedPassword === null) ? createUserDto.email : null,
    };

    const createdUser = await this.prisma.user.create({ data });
    if (!createdUser) {
      throw new HttpException('Error creating user', 500);
    }

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: prismaExclude('User', ['password']),
    });
    if (!users) {
      throw new HttpException('Error finding users', 500);
    } else if (users.length === 0) {
      throw new HttpException('No users found', 404);
    }

    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: prismaExclude('User', ['password']),
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async getUserData(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...prismaExclude('User', ['password']),
        createdAt: false,
        email: false,
        token: false,
        StudyPlans: true,
        Subjects: true,
        Activities: true,
        Reviews: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const topics = await this.prisma.topics.findMany({
      where: { subjectId: { in: user.Subjects.map((subject) => subject.id) } },
    });
    if (!topics) {
      throw new HttpException('Error finding topics', 500);
    }

    user.Subjects = user.Subjects.map((subject) => {
      const subjectTopics = topics.filter(
        (topic) => topic.subjectId === subject.id,
      );
      return {
        ...subject,
        Topics: subjectTopics,
      };
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findByEmailOrReturnNull(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });

    if (!updatedUser) {
      throw new HttpException('Error updating user', 500);
    }

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });
    if (!deletedUser) {
      throw new HttpException('Error deleting user', 500);
    }

    return 'User deleted';
  }

  async updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    if (
      updateUserPasswordDto.currentPassword ===
      updateUserPasswordDto.newPassword
    ) {
      throw new HttpException(
        'New password cannot be the same as the current password',
        400,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(
      updateUserPasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid current password', 401);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: await bcrypt.hash(updateUserPasswordDto.newPassword, 10),
      },
    });

    if (!updatedUser) {
      throw new HttpException('Error updating password', 500);
    }

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        token: hash,
      },
    });

    const link = `studyplus.com/passwordReset?token=${resetToken}&id=${user.id}`;

    sendEmail(
      user.email,
      'Password Reset Request',
      'Password Reset Request',
      `<p>Please click the link below to reset your password:</p><a>${link}</a>`,
    );

    return link;
  }

  async resetPassword(resetPasswordUserDto: ResetPasswordUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: resetPasswordUserDto.id },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const userToken = user.token;
    if (!userToken) {
      throw new Error('Invalid or expired password reset token');
    }

    const isValid = await bcrypt.compare(resetPasswordUserDto.token, userToken);
    if (!isValid) {
      throw new Error('Invalid or expired password reset token');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(resetPasswordUserDto.password, 10),
      },
    });

    if (!updatedUser) {
      throw new HttpException('Error updating password', 500);
    }

    sendEmail(
      user.email,
      'Password Reset Successfully',
      'Password Reset Successfully',
      '<p>Your password has been reset successfully.</p>',
    );

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  async updateUserLinks(id: string, googleEmail: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const existingUserWithGoogleEmail = await this.prisma.user.findUnique({
      where: { googleEmail },
    });
    if (existingUserWithGoogleEmail) {
      throw new HttpException(
        'This Google account is already linked to another user',
        400,
      );
    }

    if (user.googleAccountLinked) {
      throw new HttpException('User already linked to Google Account', 400);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        googleEmail,
        googleAccountLinked: true,
      },
    });
    if (!updatedUser) {
      throw new HttpException('Error linking account', 500);
    }

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  async findByGoogleEmail(googleEmail: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { googleEmail },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async findBySearchArg(searchArg: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchArg } },
          { email: { contains: searchArg } },
        ],
      },
    });

    if (!users) {
      throw new HttpException('Error finding users', 500);
    } else if (users.length === 0) {
      throw new HttpException('No users found', 404);
    }

    return users;
  }

  async findUserStudyPlans(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { StudyPlans: true },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user.StudyPlans;
  }

  async findUserSubjects(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { Subjects: true },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user.Subjects;
  }
}
