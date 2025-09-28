import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { ProcessPaymentInput } from './dto/create-order.input';
import { PaymentResponse } from './dto/order.response';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async checkout(@Context() context) {
    const userId = context.req.user.id;
    return this.orderService.checkout(userId);
  }

  @Mutation(() => PaymentResponse)
  @UseGuards(GqlAuthGuard)
  async processPayment(@Args('input') input: ProcessPaymentInput, @Context() context) {
    const userId = context.req.user.id;
    return this.orderService.processPayment(input.orderId, input.paymentMethod, userId);
  }

  @Query(() => [Order])
  @UseGuards(GqlAuthGuard)
  async myOrders(@Context() context) {
    const userId = context.req.user.id;
    return this.orderService.getUserOrders(userId);
  }

  @Query(() => [Order])
  @UseGuards(GqlAuthGuard)
  async myStoreOrders(@Context() context) {
    const sellerId = context.req.user.id;
    return this.orderService.getSellerOrders(sellerId);
  }
}