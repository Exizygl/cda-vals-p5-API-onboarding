import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { RoleMapper } from './role.mapper';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

const createMockRepository = (): jest.Mocked<Repository<any>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
} as any);

describe('RoleService', () => {
  let service: RoleService;
  let repository: jest.Mocked<Repository<Role>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repository = module.get(getRepositoryToken(Role));
  });

  describe('findByIds', () => {
    it('should return roles by ids', async () => {
      const roles = [{ id: '1' } as Role, { id: '2' } as Role];
      repository.find.mockResolvedValue(roles);

      const result = await service.findByIds(['1', '2']);
      expect(repository.find).toHaveBeenCalledWith({ where: { id: expect.any(Object) } });
      expect(result).toEqual(roles);
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const roles = [{ id: '1' } as Role];
      repository.find.mockResolvedValue(roles);

      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(roles);
    });
  });

  describe('findSelectionnable', () => {
    it('should return selectionnable roles', async () => {
      const roles = [{ id: '1', selectionnable: true } as Role];
      repository.find.mockResolvedValue(roles);

      const result = await service.findSelectionnable();
      expect(repository.find).toHaveBeenCalledWith({ where: { selectionnable: true } });
      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should return a role if found', async () => {
      const role = { id: '1' } as Role;
      repository.findOne.mockResolvedValue(role);

      const result = await service.findOne('1');
      expect(result).toEqual(role);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

describe('create', () => {
  it('should create and return a role', async () => {
    const dto: CreateRoleDto = { id: '1', nom: 'Admin', selectionnable: true };
    const mappedRole = { ...dto } as Role;

    jest.spyOn(RoleMapper, 'fromCreateDto').mockReturnValue(mappedRole);
    repository.save.mockResolvedValue(mappedRole);

    const result = await service.create(dto);
    expect(RoleMapper.fromCreateDto).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(mappedRole);
    expect(result).toEqual(mappedRole);
  });
});

  describe('update', () => {
    it('should update and return the role', async () => {
      const existingRole = { id: '1', nom: 'User' } as Role;
      const dto: UpdateRoleDto = { nom: 'Updated' };
      const updatedRole = { id: '1', nom: 'Updated' } as Role;

      repository.findOne.mockResolvedValue(existingRole);
      jest.spyOn(RoleMapper, 'fromUpdateDto').mockReturnValue(updatedRole);
      repository.save.mockResolvedValue(updatedRole);

      const result = await service.update('1', dto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(RoleMapper.fromUpdateDto).toHaveBeenCalledWith(dto, existingRole);
      expect(repository.save).toHaveBeenCalledWith(updatedRole);
      expect(result).toEqual(updatedRole);
    });

    it('should throw NotFoundException if role not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update('99', { nom: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the role', async () => {
      const role = { id: '1' } as Role;
      repository.findOne.mockResolvedValue(role);
      repository.remove.mockResolvedValue(role);

      await service.remove('1');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.remove).toHaveBeenCalledWith(role);
    });

    it('should throw NotFoundException if role not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('99')).rejects.toThrow(NotFoundException);
    });
  });
});
