import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}
  async create(createMessageDto: CreateMessageDto, user: IUser) {
    try {
      const { activate } = await this.userService.id(createMessageDto.to);
      if (!activate) {
        throw new UnauthorizedException(
          'User cannot receive messages at the moment. Send a message when the user is active.',
        );
      }
      const createdMessage = await this.prisma.message.create({
        data: {
          from: {
            connect: {
              id: user.id,
            },
          },
          to: {
            connect: {
              id: createMessageDto.to,
            },
          },
          content: createMessageDto.content,
        },
      });

      await this.notificationsService.create({
        content: `You have a new message from: ${user.email}`,
        owner: createMessageDto.to,
      });

      return createdMessage;
    } catch (error) {
      throw error;
    }
  }

  async findSendMessages(paginationDto: PaginationDto, user: IUser) {
    const totalPages = await this.prisma.message.count({
      where: {
        fromId: user.id,
      },
    });
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;
    const messages = await this.prisma.message.findMany({
      where: {
        fromId: user.id,
      },
      select: {
        to: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        content: true,
        id: true,
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    });

    return {
      data: messages,
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findReceiveMessages(paginationDto: PaginationDto, user: IUser) {
    const totalPages = await this.prisma.message.count({
      where: {
        toId: user.id,
      },
    });
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;
    const messages = await this.prisma.message.findMany({
      where: {
        toId: user.id,
      },
      select: {
        from: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        content: true,
        id: true,
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    });
    return {
      data: messages,
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }
}
