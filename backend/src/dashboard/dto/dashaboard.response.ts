import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
export class BestSeller {
  @Field(() => Product)
  product: Product;

  @Field()
  sales: number;
}

@ObjectType()
export class SellerStats {
  @Field()
  totalProducts: number;

  @Field()
  totalSold: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => BestSeller, { nullable: true })
  bestSeller: BestSeller | null;
}