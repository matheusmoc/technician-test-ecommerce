import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductInput, ProductsFilterInput } from './dto/create-product.input';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard)
  async createProduct(
    @Args('input') input: CreateProductInput,
    @Context() context,
  ) {
    // Verifique se o usuário está definido
    if (!context.req.user) {
      throw new Error('Usuário não autenticado');
    }
    
    const sellerId = context.req.user.id;
    return this.productService.createProduct(input, sellerId);
  }

  @Query(() => [Product])
  async products(@Args('filter', { nullable: true }) filter: ProductsFilterInput) {
    return this.productService.findAll(filter);
  }

  @Query(() => [Product])
  @UseGuards(GqlAuthGuard)
  async myProducts(@Context() context) {
    // Verificação adicional de segurança
    if (!context.req.user || !context.req.user.id) {
      throw new Error('Usuário não autenticado');
    }
    
    const sellerId = context.req.user.id;
    return this.productService.findBySeller(sellerId);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard)
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: CreateProductInput,
    @Context() context,
  ) {
    if (!context.req.user) {
      throw new Error('Usuário não autenticado');
    }
    
    const sellerId = context.req.user.id;
    return this.productService.updateProduct(id, input, sellerId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteProduct(@Args('id') id: string, @Context() context) {
    if (!context.req.user) {
      throw new Error('Usuário não autenticado');
    }
    
    const sellerId = context.req.user.id;
    return this.productService.deleteProduct(id, sellerId);
  }
}