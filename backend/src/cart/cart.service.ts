import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(userId: string, productId: string): Promise<Cart> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.getCart(userId);

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      await this.cartItemRepository.update(existingItem.id, {
        quantity: existingItem.quantity + 1,
      });
    } else {
      const newItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity: 1,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    const item = cart.items.find(item => item.productId === productId);
    
    if (item) {
      await this.cartItemRepository.delete(item.id);
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    const item = cart.items.find(item => item.productId === productId);
    
    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      await this.cartItemRepository.delete(item.id);
    } else {
      await this.cartItemRepository.update(item.id, { quantity });
    }

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<boolean> {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ cartId: cart.id });
    return true;
  }
}