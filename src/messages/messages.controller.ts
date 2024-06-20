import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/common/decorators';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@ApiTags('Mensajes')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Auth()
  @ApiOperation({
    summary: 'Enviar un mensaje desde el usuario logueado a otro user',
  })
  create(@Body() createMessageDto: CreateMessageDto, @GetUser() user: IUser) {
    return this.messagesService.create(createMessageDto, user);
  }

  @Get('send')
  @Auth()
  findSendMessages(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: IUser,
  ) {
    return this.messagesService.findSendMessages(paginationDto, user);
  }

  @Get('receive')
  @Auth()
  findReceiveMessages(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: IUser,
  ) {
    return this.messagesService.findReceiveMessages(paginationDto, user);
  }
}
