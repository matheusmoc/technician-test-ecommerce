import { ObjectType, Field } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';

@ObjectType()
export class PaymentResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Order, { nullable: true })
  order?: Order;
}