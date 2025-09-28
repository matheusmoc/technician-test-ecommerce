import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/order/entities/order.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PIX = 'PIX',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_SLIP = 'BANK_SLIP',
  PAYPAL = 'PAYPAL'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @OneToOne(() => Order, order => order.payment)
  @JoinColumn()
  order: Order;

  @Column()
  @Field()
  orderId: string;

  @Column({
    type: 'text',
    enum: PaymentMethod
  })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({
    type: 'text',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Column('decimal')
  @Field()
  amount: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}