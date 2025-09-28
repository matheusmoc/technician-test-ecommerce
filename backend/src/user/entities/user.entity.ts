import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';

export enum UserRole {
  CLIENT = 'CLIENT',
  SELLER = 'SELLER'
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @Column()
  @Field()
  name: string;

  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.CLIENT
  })
  @Field(() => UserRole)
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  storeName?: string;

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];

  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}