import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive, IsUrl, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  price: number;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsUrl()
  imageUrl: string;

  @Field()
  @IsNumber()
  @Min(0)
  stock: number;
}

@InputType()
export class ProductsFilterInput {
  @Field({ nullable: true })
  search?: string;

  @Field(() => Float, { nullable: true })
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  maxPrice?: number;

  @Field({ nullable: true })
  sellerId?: string;

  @Field({ defaultValue: 1 })
  page: number;

  @Field({ defaultValue: 10 })
  limit: number;
}