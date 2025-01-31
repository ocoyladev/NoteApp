import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }

    async login(email: string, password: string) {
        // Busca el usuario por email
        const user = await this.usersService.findByEmailAndPassword(email,password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Compara la contraseña proporcionada con la contraseña hasheada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Si todo está bien, devuelve el usuario o un token de autenticación
        return { message: 'Login successful', user };
    }
}