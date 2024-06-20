import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindByIDUserDto } from './dto/find-user-by-id.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async find(findUserbyID: FindByIDUserDto) {
    // Buscar el usuario por el correo electrónico proporcionado
    const user = await this.prisma.user.findFirst({
      where: {
        email: findUserbyID.email,
      },
    });

    return user;
  }

  async id(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
  async me(user: IUser) {
    return await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        state: true,
        activate: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const { password, ...rest } = updateUserDto;
    const updated = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...rest,
        password: await bcryptjs.hashSync(password, 10),
      },
    });
    const { password: __, ...userUpdated } = updated;
    return { message: 'Usuario actualizado correctamente', user: userUpdated };
  }

  async activate(user: IUser, query: boolean) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activate: query,
      },
    });
    return {
      message: `Usuario ${query ? 'activado' : 'desactivado'} correctamente`,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const totalPages = await this.prisma.user.count();
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;
    const users = await this.prisma.user.findMany({
      where: {
        activate: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        state: true,
        activate: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    });
    return {
      data: users,
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }
}
