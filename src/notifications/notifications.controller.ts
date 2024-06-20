import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/common/decorators';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@ApiTags('Notificaciones')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Auth()
  @ApiOperation({
    summary: 'Obtener notificaciones del usuario logueado',
  })
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: IUser) {
    return this.notificationsService.findAll(paginationDto, user);
  }
}
