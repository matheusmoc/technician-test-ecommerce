import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
@Unique(['userId', 'productId'])
@ObjectType()
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Product, product => product.favorites, { onDelete: 'CASCADE' })
  @Field(() => Product)
  product: Product;

  @Column()
  productId: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}