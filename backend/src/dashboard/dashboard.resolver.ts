import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { DashboardService } from './dashboard.service';
import { SellerStats } from './dto/dashaboard.response';

@Resolver()
export class DashboardResolver {
  constructor(private dashboardService: DashboardService) {}

  @Query(() => SellerStats)
  @UseGuards(GqlAuthGuard)
  async sellerStats(@Context() context) {
    const sellerId = context.req.user.id;
    return this.dashboardService.getSellerStats(sellerId);
  }
}