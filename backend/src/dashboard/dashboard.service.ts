import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { BestSeller, SellerStats } from './dto/dashaboard.response';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getSellerStats(sellerId: string): Promise<SellerStats> {
    const products = await this.productRepository.find({
      where: { sellerId },
      relations: ['orderItems'],
    });

    const totalProducts = products.length;
    
    let totalSold = 0;
    let revenue = 0;

    for (const product of products) {
      const productSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const productRevenue = product.orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      totalSold += productSales;
      revenue += productRevenue;
    }

    // Find best selling product
    let bestSeller: BestSeller | null = null;
    for (const product of products) {
      const productSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      if (!bestSeller || productSales > bestSeller.sales) {
        bestSeller = {
          product,
          sales: productSales,
        };
      }
    }

    return {
      totalProducts,
      totalSold,
      revenue,
      bestSeller,
    };
  }
}