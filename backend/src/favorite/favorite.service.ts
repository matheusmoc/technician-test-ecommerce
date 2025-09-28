import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async toggleFavorite(userId: string, productId: string): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, productId },
    });

    return existingFavorite
      ? (await this.favoriteRepository.delete(existingFavorite.id), false)
      : (await this.favoriteRepository.save(this.favoriteRepository.create({ userId, productId })), true);
  }

  async getUserFavorites(userId: string): Promise<Product[]> {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: ['product', 'product.seller'],
    });

    return favorites.map(favorite => favorite.product);
  }
}