import { InputType, Field } from '@nestjs/graphql';
import { PaymentMethod } from 'src/payment/entities/payment.entity';

@InputType()
export class ProcessPaymentInput {
  @Field()
  orderId: string;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;
}