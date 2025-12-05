import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "erick@gmail.com", description: "User email" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "123456", description: "User password" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
