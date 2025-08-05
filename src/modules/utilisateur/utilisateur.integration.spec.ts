import { Test, TestingModule } from '@nestjs/testing';
import { UtilisateurService } from './utilisateur.service';
import { TestAppModule } from '../../test-app.module';
import { Role } from '../role/role.entity';
import { IRoleServiceToken } from '../role/role.constants';
import { Utilisateur } from './utilisateur.entity'; // <-- add your entity
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UtilisateurService (Integration)', () => {
  let moduleRef: TestingModule;
  let service: UtilisateurService;
  let utilisateurRepository: Repository<Utilisateur>;
  let roleRepository: Repository<Role>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    service = moduleRef.get(UtilisateurService);
    utilisateurRepository = moduleRef.get<Repository<Utilisateur>>(getRepositoryToken(Utilisateur));
    roleRepository = moduleRef.get<Repository<Role>>(getRepositoryToken(Role));
  });

  beforeEach(async () => {
    await utilisateurRepository.createQueryBuilder().delete().execute();
    await roleRepository.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await moduleRef.close();  
  });

  it('should create a user with roles', async () => {
    const roleService = moduleRef.get(IRoleServiceToken);

    const role = new Role();
    role.id = '1113002409883602974';
    role.nom = 'Admin';
    role.selectionnable = false;
    const savedRole = await roleService.create(role);

    const dto = {
      id: '111300240988360297',
      nom: 'Doa',
      prenom: 'Jona',
      rolesId: [savedRole.id],
    };

    const user = await service.create(dto);
    const usersInDb = await utilisateurRepository.find(); 
    

    expect(user.id).toEqual(dto.id);
    expect(user.roles?.[0]?.id).toEqual(savedRole.id);
  });
});
