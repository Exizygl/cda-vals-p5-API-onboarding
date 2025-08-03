import { Test, TestingModule } from '@nestjs/testing';
import { UtilisateurService } from './utilisateur.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Utilisateur } from './utilisateur.entity';
import { Repository } from 'typeorm';
import { UtilisateurDto } from './dto/utilisateur.dto';
import { Role } from '../role/role.entity';

describe('UtilisateurService', () => {
  let service: UtilisateurService;
  let repo: Repository<Utilisateur>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilisateurService,
        {
          provide: getRepositoryToken(Utilisateur),
          useClass: Repository, 
        },
      ],
    }).compile();

    service = module.get<UtilisateurService>(UtilisateurService);
    repo = module.get<Repository<Utilisateur>>(getRepositoryToken(Utilisateur));
  });

  it('should create a user with roles (by ID)', async () => {
    const dto: UtilisateurDto = {
      id: '123456789012345678',
      nom: 'TestNom',
      prenom: 'TestPrenom',
      rolesId: ['1', '2'],
      identifications: [],
    };

    // The user entity expected after mapping from DTO (roles objects created from ids)
    const expectedUser = {
      ...dto,
      roles: dto.rolesId.map((id) => {
        const r = new Role();
        r.id = id;
        return r;
      }),
    };

    // Mock the repository 'create' method to return the entity-like object
    jest.spyOn(repo, 'create').mockImplementation((data) => data as any);

    // Mock the repository 'save' method to resolve with expected user entity
    jest.spyOn(repo, 'save').mockResolvedValue(expectedUser as any);

    const result = await service.create(dto);

    expect(result.id).toBe(dto.id);
    expect(result.nom).toBe(dto.nom);
    expect(result.prenom).toBe(dto.prenom);
    expect(result.roles).toHaveLength(2);
    expect(result.roles[0].id).toBe('1');
    expect(result.roles[1].id).toBe('2');
  });
});

