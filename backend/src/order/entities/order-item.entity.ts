import { Entity, PrimaryColumn, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Order } from './order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
@ObjectType()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => Product, product => product.orderItems)
  @Field(() => Product)
  product: Product;

  @Column()
  @Field()
  productId: string;

  @Column()
  @Field()
  quantity: number;

  @Column('decimal')
  @Field()
  price: number;

  @Column()
  @Field()
  name: string;
}