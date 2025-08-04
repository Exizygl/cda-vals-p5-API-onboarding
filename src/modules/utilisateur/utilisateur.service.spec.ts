import { Test, TestingModule } from '@nestjs/testing';
import { UtilisateurService } from './utilisateur.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Utilisateur } from './utilisateur.entity';
import { Repository } from 'typeorm';
import { CreateUtilisateurDto } from './dto/createUtilisateur.dto';
import { Role } from '../role/role.entity';
import { IRoleService } from '../role/interface/IRoleService';
import { IRoleServiceToken } from '../role/role.constants';
import { NotFoundException } from '@nestjs/common';

describe('UtilisateurService', () => {
  let service: UtilisateurService;
  let utilisateurRepo: {
  findOne: jest.Mock<Promise<Utilisateur | null>, any[]>;
  create: jest.Mock<Utilisateur, any[]>;
  save: jest.Mock<Promise<Utilisateur>, any[]>;
};


  const roleServiceMock: jest.Mocked<IRoleService> = {
    findByIds: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    utilisateurRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilisateurService,
        {
          provide: getRepositoryToken(Utilisateur),
          useValue: utilisateurRepo,
        },
        {
          provide: IRoleServiceToken,
          useValue: roleServiceMock,
        },
      ],
    }).compile();

    service = module.get<UtilisateurService>(UtilisateurService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user with roles (by ID)', async () => {
    const dto: CreateUtilisateurDto = {
      id: '123456789012345678',
      nom: 'TestNom',
      prenom: 'TestPrenom',
      rolesId: ['1', '2'],
    };

    const roles: Role[] = dto.rolesId.map((id) => {
      const role = new Role();
      role.id = id;
      return role;
    });

    roleServiceMock.findByIds.mockResolvedValue(roles);
    utilisateurRepo.findOne!.mockResolvedValue(null);

    const createdUser = {
      id: dto.id,
      nom: dto.nom,
      prenom: dto.prenom,
      roles,
      identifications: [],
    } as Utilisateur;

    utilisateurRepo.create!.mockReturnValue(createdUser);
    utilisateurRepo.save!.mockResolvedValue(createdUser);

    const result = await service.create(dto);

    expect(result).toEqual(createdUser);
    expect(roleServiceMock.findByIds).toHaveBeenCalledWith(dto.rolesId);
    expect(utilisateurRepo.create).toHaveBeenCalled();
    expect(utilisateurRepo.save).toHaveBeenCalledWith(createdUser);
  });

  it('should throw if user already exists', async () => {
  const dto: CreateUtilisateurDto = {
    id: '123456789012345678',
    nom: 'TestNom',
    prenom: 'TestPrenom',
    rolesId: ['1', '2'],
  };

  const existingUser = new Utilisateur();
  utilisateurRepo.findOne.mockResolvedValue(existingUser); 

  await expect(service.create(dto)).rejects.toThrow('Utilisateur avec ce snowflake trouver.');
});

  it('should throw if roles not found', async () => {
  const dto: CreateUtilisateurDto = {
    id: '123456789012345678',
    nom: 'TestNom',
    prenom: 'TestPrenom',
    rolesId: ['1', '2'],
  };

  utilisateurRepo.findOne.mockResolvedValue(null);
  roleServiceMock.findByIds.mockResolvedValue([]); 

  await expect(service.create(dto)).rejects.toThrow(NotFoundException);

});

});
