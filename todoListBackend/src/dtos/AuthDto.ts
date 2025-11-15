export class RegisterDto {
  email: string;
  username: string;
  password: string;
}

export class LoginDto {
  username: string;
  password: string;
}

export class AuthResponseDto {
  id: string;
  email: string;
  username: string;
  token: string;
}
