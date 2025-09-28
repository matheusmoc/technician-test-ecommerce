import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Cart } from './cart.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
@Unique(['cartId', 'productId'])
@ObjectType()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @Column()
  cartId: string;

  @ManyToOne(() => Product, product => product.cartItems, { onDelete: 'CASCADE' })
  @Field(() => Product)
  product: Product;

  @Column()
  @Field()
  productId: string;

  @Column({ default: 1 })
  @Field()
  quantity: number;
}