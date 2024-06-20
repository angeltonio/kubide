import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getToken(user: JwtPayload) {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      user: user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user) {
        throw new UnauthorizedException({
          message: 'User already exists',
        });
      }

      const newUser = await this.prisma.user.create({
        data: {
          email: email,
          password: bcryptjs.hashSync(password, 10),
          name: name,
        },
      });

      const { password: __, ...rest } = newUser;

      return {
        user: rest,
      };
    } catch (error) {
      throw new UnauthorizedException({
        status: 400,
        message: error.message,
      });
    }
  }
  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          roles: true,
          createdAt: true, //comentar si no se quiere mostrar esto...
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not valid');
      }

      const isPasswordValid = bcryptjs.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new NotFoundException('User/Password not valid');
      }

      const { password: __, ...rest } = user;

      return this.getToken(rest);
    } catch (error) {
      throw error;
    }
  }
}
