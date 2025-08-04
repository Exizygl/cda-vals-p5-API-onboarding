import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import { CreateUtilisateurDto } from './dto/createUtilisateur.dto';
import { IUtilisateurService } from './interfaces/IUtilisateurService';
import { IRoleServiceToken } from '../role/role.constants';
import { IRoleService }from '../role/interface/IRoleService';



@Injectable()
export class UtilisateurService implements IUtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    
    @Inject(IRoleServiceToken)
    private readonly roleService: IRoleService,
  ) {}

  async create(dto: CreateUtilisateurDto): Promise<Utilisateur> {

    const existingUser = await this.utilisateurRepository.findOne({ where: { id: dto.id } });
    if (existingUser) {
    throw new ConflictException('Utilisateur avec ce snowflake trouver.');
    }
    
    const roles = await this.roleService.findByIds(dto.rolesId);

    if (roles.length !== dto.rolesId.length) {
      const foundIds = roles.map((r) => r.id);
      const missing = dto.rolesId.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Role(s) pas trouver: ${missing.join(', ')}`);
    }
    const utilisateur = this.utilisateurRepository.create(dto);
    return this.utilisateurRepository.save(utilisateur);
  }

}
