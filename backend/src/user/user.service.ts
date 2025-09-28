import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async deleteAccount(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user && user.role === 'SELLER') {
      await this.productRepository.update(
        { sellerId: userId },
        { isActive: false }
      );
      await this.userRepository.update(userId, { isActive: false });
    } else {
      await this.userRepository.update(userId, { isActive: false });
    }

    return true;
  }
}