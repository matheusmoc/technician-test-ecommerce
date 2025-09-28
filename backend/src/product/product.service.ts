import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository, Like, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput, ProductsFilterInput } from './dto/create-product.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(input: CreateProductInput, sellerId: string): Promise<Product> {
    const product = this.productRepository.create({
      ...input,
      sellerId,
    });

    return this.productRepository.save(product);
  }

  async findAll(filter?: ProductsFilterInput): Promise<Product[]> {
    const { search, minPrice, maxPrice, sellerId, page = 1, limit = 10 } = filter || {};
    
    const where: any = { isActive: true };
    
    if (search) {
      where.name = Like(`%${search}%`);
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(minPrice || 0, maxPrice || 999999);
    }
    
    if (sellerId) {
      where.sellerId = sellerId;
    }

    return this.productRepository.find({
      where,
      relations: ['seller'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findBySeller(sellerId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { sellerId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateProduct(id: string, input: CreateProductInput, sellerId: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    if (product.sellerId !== sellerId) {
      throw new UnauthorizedException('You can only update your own products');
    }

    await this.productRepository.update(id, input);
    const updatedProduct = await this.productRepository.findOne({ where: { id } });
    if (!updatedProduct) {
      throw new NotFoundException('Updated product not found');
    }
    return updatedProduct;
  }

  async deleteProduct(id: string, sellerId: string): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    if (product.sellerId !== sellerId) {
      throw new UnauthorizedException('You can only delete your own products');
    }

    await this.productRepository.delete(id);
    return true;
  }

  // Dashboard statistics for sellers
  async getSellerStats(sellerId: string) {
    const products = await this.productRepository.find({
      where: { sellerId },
      relations: ['orderItems'],
    });

    const totalProducts = products.length;
    const totalSold = products.reduce((sum, product) => {
      return sum + product.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    const revenue = products.reduce((sum, product) => {
      return sum + product.orderItems.reduce((itemSum, item) => itemSum + (item.quantity * item.price), 0);
    }, 0);

    // Find best selling product
    const bestSeller = products.reduce<{ product: Product; sales: number } | null>((best, product) => {
      const productSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      return !best || productSales > best.sales ? { product, sales: productSales } : best;
    }, null);

    return {
      totalProducts,
      totalSold,
      revenue,
      bestSeller: bestSeller ? {
        product: bestSeller.product,
        sales: bestSeller.sales
      } : null
    };
  }
}