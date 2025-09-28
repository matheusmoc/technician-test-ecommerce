import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from 'src/payment/entities/payment.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@Entity()
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Column()
  @Field()
  userId: string;

  @Column('decimal')
  @Field()
  total: number;

  @Column({
    type: 'text',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  @Field(() => [OrderItem])
  items: OrderItem[];

  @OneToOne(() => Payment, payment => payment.order)
  @Field(() => Payment, { nullable: true })
  payment: Payment;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}