import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { IRoleService } from './interface/IRoleService';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { Role } from './role.entity';

describe('RoleController', () => {
  let controller: RoleController;
  let service: jest.Mocked<IRoleService>;

  const mockRole: Role = {
    id: '1',
    nom: 'Admin',
    selectionnable: true,
    dateCreation: new Date(),
    dateModification: new Date(),
    utilisateurs: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: 'IRoleServiceToken',
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByIds: jest.fn(),
            findSelectionnable: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get('IRoleServiceToken');
  });

  it('should return all roles', async () => {
    service.findAll.mockResolvedValue([mockRole]);
    const result = await controller.findAll();
    expect(result).toEqual([mockRole]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a role by id', async () => {
    service.findOne.mockResolvedValue(mockRole);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockRole);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a role', async () => {
    const dto: CreateRoleDto = {
      id: '1',
      nom: 'Admin',
      selectionnable: true,
    };
    service.create.mockResolvedValue(mockRole);
    const result = await controller.create(dto);
    expect(result).toEqual(mockRole);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update a role', async () => {
    const dto: UpdateRoleDto = {
      nom: 'User',
    };
    service.update.mockResolvedValue({ ...mockRole, nom: 'User' });
    const result = await controller.update('1', dto);
    expect(result.nom).toBe('User');
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove a role', async () => {
    service.remove.mockResolvedValue(undefined);
    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'Role deleted successfully' });
    expect(service.remove).toHaveBeenCalledWith('1');
  });

  it('should return only selectionnable roles', async () => {
    service.findSelectionnable.mockResolvedValue([mockRole]);
    const result = await controller.findSelectionnable();
    expect(result).toEqual([mockRole]);
    expect(service.findSelectionnable).toHaveBeenCalled();
  });
});
