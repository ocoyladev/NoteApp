import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService, // Inyecta UsersService
    ) { }

    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string) {
        return this.authService.login(email, password);
    }
}