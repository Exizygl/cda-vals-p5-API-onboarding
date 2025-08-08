import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { IRoleService } from './interface/IRoleService';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { Role } from './role.entity';
import { IRoleServiceToken } from './role.constants';

describe('RoleController', () => {
  let controller: RoleController;
  let roleServiceMock: jest.Mocked<IRoleService>;

  const mockRole: Role = {
    id: '1',
    nom: 'Admin',
    selectionnable: true,
    dateCreation: new Date(),
    dateModification: new Date(),
    utilisateurs: [],
  };

  beforeEach(async () => {
    roleServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByIds: jest.fn(),
      findSelectionnable: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: IRoleServiceToken,
          useValue: roleServiceMock,
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    roleServiceMock = module.get(IRoleServiceToken);
  });

  it('should return all roles', async () => {
    roleServiceMock.findAll.mockResolvedValue([mockRole]);
    const result = await controller.findAll();
    expect(result).toEqual([mockRole]);
    expect(roleServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return a role by id', async () => {
    roleServiceMock.findOne.mockResolvedValue(mockRole);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockRole);
    expect(roleServiceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a role', async () => {
    const dto: CreateRoleDto = {
      id: '1',
      nom: 'Admin',
      selectionnable: true,
    };
    roleServiceMock.create.mockResolvedValue(mockRole);
    const result = await controller.create(dto);
    expect(result).toEqual(mockRole);
    expect(roleServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should update a role', async () => {
    const dto: UpdateRoleDto = {
      nom: 'User',
    };
    roleServiceMock.update.mockResolvedValue({ ...mockRole, nom: 'User' });
    const result = await controller.update('1', dto);
    expect(result.nom).toBe('User');
    expect(roleServiceMock.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove a role', async () => {
    roleServiceMock.remove.mockResolvedValue(undefined);
    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'Role deleted successfully' });
    expect(roleServiceMock.remove).toHaveBeenCalledWith('1');
  });

  it('should return only selectionnable roles', async () => {
    roleServiceMock.findSelectionnable.mockResolvedValue([mockRole]);
    const result = await controller.findSelectionnable();
    expect(result).toEqual([mockRole]);
    expect(roleServiceMock.findSelectionnable).toHaveBeenCalled();
  });
});