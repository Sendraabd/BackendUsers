import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'output/entities/Users';
import { BusinessEntity } from 'output/entities/BusinessEntity';
import { UsersEmail } from 'output/entities/UsersEmail';
import { UsersEducation } from 'output/entities/UsersEducation';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { UsersPhones } from 'output/entities/UsersPhones';
import { UsersRoles } from 'output/entities/UsersRoles';
import { Roles } from 'output/entities/Roles';
import { JwtService } from '@nestjs/jwt';

const salt = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(BusinessEntity)
    private businessEntityRepository: Repository<BusinessEntity>,
    @InjectRepository(UsersEmail)
    private UsersEmailRepository: Repository<UsersEmail>,
    @InjectRepository(UsersPhones)
    private UsersPhonesRepository: Repository<UsersPhones>,
    @InjectRepository(UsersRoles)
    private UsersRolesRepository: Repository<UsersRoles>,
    @InjectRepository(Roles)
    private RolesRepository: Repository<Roles>,
    @InjectRepository(UsersEducation)
    private UsduRepository: Repository<UsersEducation>,
    private jwtService: JwtService,
  ) {}

  public async findAll() {
    return await this.userRepo.find({
      relations: {
        usersRoles: true,
      },
    });
  }

  public async findOne(id: number) {
    return await this.userRepo.findOne({
      where: {
        userEntityId: id,
      },
    });
  }

  public async applyupdate(file, id: number, fields: any) {
    try {
      const birthdate = new Date(fields.birthdate);

      if (isNaN(birthdate.getTime())) {
        throw new Error('Invalid birthdate format');
      }

      const user = await this.userRepo.update(id, {
        userName: fields.name,
        userFirstName: fields.firstname,
        userLastName: fields.lastname,
        userBirthDate: birthdate,
        userModifiedDate: new Date(),
        userPhoto: file.filename,
      });

      const education = await this.UsduRepository.save({
        usduEntityId: id,
        usduSchool: fields.school,
        usduDegree: fields.degree,
        usduFieldStudy: fields.study,
        usduModifiedDate: new Date(),
      });

      return { user, education };
    } catch (error) {
      throw new Error('Failed to update user data: ' + error.message);
    }
  }

  public async delete(id: number) {
    await this.UsersPhonesRepository.delete({ uspoEntityId: id });
    await this.UsersEmailRepository.delete({ pmailEntityId: id });
    await this.UsersRolesRepository.delete({ usroEntityId: id });
    await this.UsduRepository.delete({ usduEntityId: id });
    await this.userRepo.delete({ userEntityId: id });

    await this.businessEntityRepository.delete({
      entityId: id,
    });
  }

  public async signup(fields: any) {
    try {
      const businessEntity = new BusinessEntity();
      const savedBusinessEntity = await this.businessEntityRepository.save(
        businessEntity,
      );
      const entity_id = savedBusinessEntity.entityId;
      const hashPassword = await Bcrypt.hash(fields.password, salt);
      const confirmPassword = fields.confirmpass;

      if (fields.password !== confirmPassword) {
        throw new Error('Password and confirm password do not match.');
      }

      let role;

      if (fields.apply === 'bootcamp') {
        role = await this.RolesRepository.findOne({
          where: { roleName: 'Candidat' },
        });
        if (!role) {
          throw new Error('Candidate role not found.');
        }
      } else if (fields.apply === 'jobs') {
        role = await this.RolesRepository.findOne({
          where: { roleName: 'Talent' },
        });
        if (!role) {
          throw new Error('Talent role not found.');
        }
      } else {
        throw new Error('Invalid role.');
      }

      const roleId = role.roleId;

      const user = await this.userRepo.save({
        userEntityId: entity_id,
        userName: fields.name,
        userPassword: hashPassword,
        userCurrentRole: roleId,
        userModifiedDate: new Date(),
      });

      const userEmail = await this.UsersEmailRepository.save({
        pmailEntityId: entity_id,
        pmailAddress: fields.email,
        pmailModifiedDate: new Date(),
      });

      const userPhone = await this.UsersPhonesRepository.save({
        uspoEntityId: entity_id,
        uspoNumber: fields.phone,
        uspoModifiedDate: new Date(),
      });

      const userRole = await this.UsersRolesRepository.save({
        usroEntityId: entity_id,
        usroRole: roleId,
        usroModifiedDate: new Date(),
      });

      return { user, userEmail, userPhone, userRole };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async validateUser(name: string, password: string) {
    const user = await this.userRepo.findOne({
      where: [{ userName: name }, { usersEmails: { pmailAddress: name } }],
      relations: ['usersEmails'],
    });

    if (user) {
      const compare = await Bcrypt.compare(password, user.userPassword);
      if (compare) {
        const { userPassword, ...result } = user;
        return result;
      }
    }

    return null;
  }

  public async login(user: any) {
    const payload = {
      userId: user.userEntityid,
      username: user.userName,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async editprofile(id: number, fields: any) {
    try {
      const user = await this.userRepo.update(id, {
        userName: fields.name,
        userFirstName: fields.firstname,
        userLastName: fields.lastname,
        userModifiedDate: new Date(),
      });
      return { user };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
