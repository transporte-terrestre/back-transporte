export interface JwtPayload {
  sub: number;
  tipo: 'usuario' | 'conductor';
}