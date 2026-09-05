import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    
    // Verificar si el usuario ya existe
    const userExists = await this.userRepository.findOneBy({ email: userData.email });
    if (userExists) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el usuario
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Retornamos sin la contraseña por seguridad
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    
    if (!user) {
      // Mensaje claro pero sin dar detalles exactos de qué falló (por seguridad)
      throw new BadRequestException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Login exitoso',
      user: userWithoutPassword,
    };
  }
}