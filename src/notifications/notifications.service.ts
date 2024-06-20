import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(paginationDto: PaginationDto, user: IUser) {
    const totalPages = await this.prismaService.notifications.count({
      where: {
        ownerId: user.id,
      },
    });
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;
    const notifications = await this.prismaService.notifications.findMany({
      where: {
        ownerId: user.id,
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    });
    // AQUI SE ACTUALIZA EL ESTADO DE LAS NOTIFICACIONES A LEIDAS
    const notificationIds = notifications.map(
      (notification) => notification.id,
    );
    await this.prismaService.notifications.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return {
      data: notifications,
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async create(data: CreateNotificationDto) {
    return this.prismaService.notifications.create({
      data: {
        content: data.content,
        owner: {
          connect: {
            id: data.owner,
          },
        },
      },
    });
  }
}
