import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/common/decorators';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { ValidRoles } from 'src/common/interfaces/valid-roles';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(ValidRoles.user) // en este caso solo los usuarios con rol user pueden acceder a este endpoint
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @Get('me')
  me(@GetUser() user: IUser) {
    return this.usersService.me(user);
  }

  @Post('update')
  @ApiOperation({ summary: 'Actualizar información del usuario autenticado' })
  @Auth() // todos los roles pueden acceder a este enpdoint
  update(@Body() updateUserDto: UpdateUserDto, @GetUser() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @Post('activate')
  @Auth()
  @ApiOperation({
    summary: 'Activar o desactivar el usuario logueado',
  })
  activate(@Query('activate') activate: boolean, @GetUser() user: IUser) {
    return this.usersService.activate(user, activate);
  }

  @Get('all')
  @Auth()
  @ApiOperation({ summary: 'Listar todos los usuarios activos' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }
}
