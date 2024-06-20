import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(paginationDto: PaginationDto, user: IUser) {
    return this.prismaService.notifications.findMany({
      where: {
        ownerId: user.id,
      },
    });
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
