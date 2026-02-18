import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ConductorLoginDto } from './dto/conductor-login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResultDto } from './dto/login-result.dto';
import { ConductorLoginResultDto } from './dto/conductor-login-result.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, type: LoginResultDto })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResultDto> {
    return await this.authService.login(loginDto);
  }

  @Post('conductor/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de conductor' })
  @ApiResponse({ status: 200, type: ConductorLoginResultDto })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async loginConductor(@Body() loginDto: ConductorLoginDto): Promise<ConductorLoginResultDto> {
    return await this.authService.loginConductor(loginDto);
  }
}
