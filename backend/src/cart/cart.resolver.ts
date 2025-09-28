import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async addToCart(@Args('productId') productId: string, @Context() context) {
    const userId = context.req.user.id;
    return this.cartService.addToCart(userId, productId);
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async removeFromCart(@Args('productId') productId: string, @Context() context) {
    const userId = context.req.user.id;
    return this.cartService.removeFromCart(userId, productId);
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard)
  async updateCartItem(
    @Args('productId') productId: string,
    @Args('quantity') quantity: number,
    @Context() context,
  ) {
    const userId = context.req.user.id;
    return this.cartService.updateCartItem(userId, productId, quantity);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async clearCart(@Context() context) {
    const userId = context.req.user.id;
    return this.cartService.clearCart(userId);
  }

  @Query(() => Cart)
  @UseGuards(GqlAuthGuard)
  async cart(@Context() context) {
    const userId = context.req.user.id;
    return this.cartService.getCart(userId);
  }
}