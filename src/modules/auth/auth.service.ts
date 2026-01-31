import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from '@repository/usuario.repository';
import { ConductorRepository } from '@repository/conductor.repository';
import { LoginDto } from './dto/login.dto';
import { LoginResultDto } from './dto/login-result.dto';
import { ConductorLoginDto } from './dto/conductor-login.dto';
import { ConductorLoginResultDto } from './dto/conductor-login-result.dto';
import { UsuarioDTO } from '@db/tables/usuario.table';
import { ConductorDTO } from '@db/tables/conductor.table';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly conductorRepository: ConductorRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UsuarioDTO> {
    const user = await this.usuarioRepository.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.contrasenia))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResultDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { email: user.email, sub: user.id, roles: user.roles, tipo: 'usuario' };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }

  async validateConductor(email: string, pass: string): Promise<ConductorDTO> {
    const conductor = await this.conductorRepository.findByEmail(email);
    if (!conductor || !conductor.contrasenia) {
      return null;
    }
    if (await bcrypt.compare(pass, conductor.contrasenia)) {
      return conductor;
    }
    return null;
  }

  async loginConductor(loginDto: ConductorLoginDto): Promise<ConductorLoginResultDto> {
    const conductor = await this.validateConductor(loginDto.email, loginDto.password);
    if (!conductor) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      email: conductor.email,
      sub: conductor.id,
      tipo: 'conductor',
      dni: conductor.dni,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      conductor: {
        id: conductor.id,
        dni: conductor.dni,
        nombres: conductor.nombres,
        apellidos: conductor.apellidos,
        nombreCompleto: conductor.nombreCompleto,
        email: conductor.email,
        celular: conductor.celular,
        numeroLicencia: conductor.numeroLicencia,
        claseLicencia: conductor.claseLicencia,
        categoriaLicencia: conductor.categoriaLicencia,
        fotocheck: conductor.fotocheck,
      },
    };
  }
}
