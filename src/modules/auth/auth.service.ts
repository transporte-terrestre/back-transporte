import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from '@repository/usuario.repository';
import { LoginDto } from './dto/login.dto';
import { LoginResultDto } from './dto/login-result.dto';
import { UsuarioDTO } from '@db/tables/usuario.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }
}
