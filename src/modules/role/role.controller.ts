import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { IRoleServiceToken } from './role.constants';
import { IRoleService } from './interface/IRoleService';
@Controller('roles')
export class RoleController {
  constructor(@Inject(IRoleServiceToken)
    private readonly roleService: IRoleService,) {}

  @Get()
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.roleService.remove(id);
    return { message: 'Role deleted successfully' };
  }

    @Get('selectionnables')
  async findSelectionnable() {
    return this.roleService.findSelectionnable(); 
  }
}