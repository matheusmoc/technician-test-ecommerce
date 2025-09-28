import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Favorite } from './entities/favorite.entity';
import { Product } from 'src/product/entities/product.entity';
import { FavoriteService } from './favorite.service';

@Resolver(() => Favorite)
export class FavoriteResolver {
  constructor(private favoriteService: FavoriteService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async toggleFavorite(@Args('productId') productId: string, @Context() context) {
    const userId = context.req.user.id;
    return this.favoriteService.toggleFavorite(userId, productId);
  }

  @Query(() => [Product])
  @UseGuards(GqlAuthGuard)
  async favorites(@Context() context) {
    const userId = context.req.user.id;
    return this.favoriteService.getUserFavorites(userId);
  }
}