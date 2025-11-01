import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GuestService } from './guest.service';
import { SearchProductsDto } from './dto/search-products.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { PriceRangeDto } from './dto/price-range.dto';
import { ReviewDto } from './dto/review.dto';

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  // (1) GET /guest/products?query=&category=&page=&limit=
  @Get('products')
  searchProducts(@Query() dto: SearchProductsDto) {
    return this.guestService.searchProducts(dto);
  }

  // (2) GET /guest/products/:id
  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.guestService.getProduct(id);
  }

  // (3) POST /guest/products/category
  @Post('products/category')
  filterByCategory(@Body() dto: FilterCategoryDto) {
    return this.guestService.filterByCategory(dto);
  }

  // (4) POST /guest/products/price-range
  @Post('products/price-range')
  filterByPriceRange(@Body() dto: PriceRangeDto) {
    return this.guestService.filterByPriceRange(dto);
  }

  // (5) GET /guest/categories
  @Get('categories')
  getCategories() {
    return this.guestService.getCategories();
  }

  // (6) POST /guest/products/:id/reviews
  @Post('products/:id/reviews')
  addReview(@Param('id') id: string, @Body() dto: ReviewDto) {
    return this.guestService.addReview(id, dto);
  }

  // (7) GET /guest/products/:id/reviews
  @Get('products/:id/reviews')
  getProductReviews(@Param('id') id: string) {
    return this.guestService.getProductReviews(id);
  }

  // (8) GET /guest/recommendations
  @Get('recommendations')
  getRecommendations() {
    return this.guestService.getRecommendations();
  }
}