import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { RegisterInput, LoginInput } from './dto/create-auth.input';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const { email, password, name, role, storeName } = input;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
      storeName: role === 'SELLER' ? storeName : undefined,
    });

    const savedUser = await this.userRepository.save(user);


    if (role === 'CLIENT') {
      const cart = this.cartRepository.create({
        userId: savedUser.id,
        items: [],
      });
      await this.cartRepository.save(cart);
    }

    const token = this.jwtService.sign({ userId: savedUser.id });

    return {
      token,
      user: savedUser,
    };
  }

  async login(input: LoginInput) {
    const { email, password } = input;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const token = this.jwtService.sign({ userId: user.id });

    return {
      token,
      user,
    };
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}