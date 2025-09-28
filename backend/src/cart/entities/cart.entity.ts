import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity()
@ObjectType()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @OneToOne(() => User, user => user.cart)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  @Field(() => [CartItem])
  items: CartItem[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}