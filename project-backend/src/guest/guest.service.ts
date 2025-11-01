import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Review } from './entities/review.entity';
import { SearchProductsDto } from './dto/search-products.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { PriceRangeDto } from './dto/price-range.dto';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class GuestService {
  private products: Product[] = [
    { id: 'p1', name: 'Banana', category: 'Fruits', price: 1.99, rating: 4.5, available: true },
    { id: 'p2', name: 'Milk', category: 'Dairy', price: 2.49, rating: 4.2, available: true },
    { id: 'p3', name: 'Bread', category: 'Bakery', price: 2.99, rating: 4.7, available: false },
  ];

  private reviews: Review[] = [];

  private ok(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  // 1️⃣ List all products with pagination / search
  searchProducts(dto: SearchProductsDto) {
    let results = [...this.products];
    if (dto.query) results = results.filter(p => p.name.toLowerCase().includes(dto.query?.toLowerCase() ?? ''));
    if (dto.category) results = results.filter(p => p.category.toLowerCase() === dto.category?.toLowerCase());
    const total = results.length;
    const limit = dto.limit ?? 10;
    const start = ((dto.page ?? 1) - 1) * limit;
    const paged = results.slice(start, start + limit);
    return this.ok(paged, { total, page: dto.page, limit: dto.limit });
  }

  // 2️⃣ Get single product
  getProduct(id: string) {
    return this.ok(this.products.find(p => p.id === id) ?? null);
  }

  // 3️⃣ Filter by category
  filterByCategory(dto: FilterCategoryDto) {
    const data = this.products.filter(p => p.category.toLowerCase() === dto.category.toLowerCase());
    return this.ok(data, { count: data.length });
  }

  // 4️⃣ Filter by price range
  filterByPriceRange(dto: PriceRangeDto) {
    const data = this.products.filter(p => p.price >= dto.min && p.price <= dto.max);
    return this.ok(data, { count: data.length });
  }

  // 5️⃣ Get all available categories
  getCategories() {
    const categories = [...new Set(this.products.map(p => p.category))];
    return this.ok(categories);
  }

  // 6️⃣ Post a review
  addReview(productId: string, dto: ReviewDto) {
    const review: Review = {
      id: 'r_' + Date.now(),
      productId,
      guestName: dto.guestName,
      rating: dto.rating,
      comment: dto.comment,
      createdAt: new Date(),
    };
    this.reviews.push(review);
    return this.ok(review, { message: 'Review submitted' });
  }

  // 7️⃣ Get all reviews for a product
  getProductReviews(productId: string) {
    const data = this.reviews.filter(r => r.productId === productId);
    return this.ok(data, { count: data.length });
  }

  // 8️⃣ Get recommended products
  getRecommendations() {
    const sorted = this.products.sort((a, b) => b.rating - a.rating);
    return this.ok(sorted.slice(0, 3), { message: 'Top-rated products' });
  }
}
