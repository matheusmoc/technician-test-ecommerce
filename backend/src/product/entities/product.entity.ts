import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column('decimal')
  @Field()
  price: number;

  @Column('text')
  @Field()
  description: string;

  @Column()
  @Field()
  imageUrl: string;

  @Column({ default: 0 })
  @Field()
  stock: number;

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  publishedDate: Date;

  @ManyToOne(() => User, user => user.products)
  @Field(() => User) 
  seller: User;

  @Column()
  @Field()
  sellerId: string;

  @OneToMany(() => Favorite, favorite => favorite.product)
  favorites: Favorite[];

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}