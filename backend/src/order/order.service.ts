import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Payment, PaymentMethod, PaymentStatus } from 'src/payment/entities/payment.entity';
import { PaymentResponse } from './dto/order.response';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async checkout(userId: string): Promise<Order> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Check stock and calculate total
    let total = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product: ${item.product.name}`);
      }

      const itemTotal = item.product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
      });

      // Update product stock
      await this.productRepository.update(item.productId, {
        stock: item.product.stock - item.quantity,
      });
    }

    // Create order
    const order = this.orderRepository.create({
      userId,
      total,
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Clear cart
    await this.cartItemRepository.delete({ cartId: cart.id });

    return savedOrder;
  }

  async processPayment(orderId: string, paymentMethod: PaymentMethod, userId: string): Promise<PaymentResponse> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new UnauthorizedException('You can only pay for your own orders');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order already processed');
    }

    // Create payment
    const payment = this.paymentRepository.create({
      orderId,
      paymentMethod,
      amount: order.total,
      status: PaymentStatus.COMPLETED, // Simulate successful payment
    });

    await this.paymentRepository.save(payment);

    // Update order status
    await this.orderRepository.update(orderId, { status: OrderStatus.PAID });

    const updatedOrder = await this.orderRepository.findOne({ where: { id: orderId } });

    return {
      success: true,
      message: 'Payment processed successfully',
      order: updatedOrder || undefined,
    };
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSellerOrders(sellerId: string): Promise<Order[]> {
    // Get orders that contain products from this seller
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.payment', 'payment')
      .where('items.productId IN (SELECT id FROM product WHERE sellerId = :sellerId)', { sellerId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();

    return orders;
  }
}