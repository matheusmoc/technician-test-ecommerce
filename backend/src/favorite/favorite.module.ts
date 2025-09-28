import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteResolver } from './favorite.resolver';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Product])],
  providers: [FavoriteResolver, FavoriteService],
})
export class FavoriteModule {}