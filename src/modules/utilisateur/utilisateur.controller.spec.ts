import { Test, TestingModule } from '@nestjs/testing';
import { UtilisateurController } from './utilisateur.controller';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurDto } from './dto/utilisateur.dto';

describe('UtilisateurController', () => {
  let controller: UtilisateurController;
  let service: UtilisateurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilisateurController],
      providers: [
        {
          provide: UtilisateurService,
          useValue: {
            create: jest.fn(), 
          },
        },
      ],
    }).compile();

    controller = module.get<UtilisateurController>(UtilisateurController);
    service = module.get<UtilisateurService>(UtilisateurService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call UtilisateurService.create and return the result', async () => {
      const dto: UtilisateurDto = {
        id: '123456789012345678',
        nom: 'TestNom',
        prenom: 'TestPrenom',
        rolesId: ['1', '2'],
        identifications: [],
      };

      const expectedResult = { ...dto, roles: [{ id: '1' }, { id: '2' }] };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
