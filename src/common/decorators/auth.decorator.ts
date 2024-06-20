import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { ValidRoles } from '../interfaces/valid-roles';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, UserRoleGuard),
    RoleProtected(...roles),
    ApiBearerAuth(),
  );
}
