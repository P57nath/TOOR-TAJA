import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from './story.entity';
import { SellerProfile } from 'src/sellers/seller-profile.entity';
import { CreateStoryDto } from './dto/create-story.dto';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storyRepo: Repository<Story>,
    @InjectRepository(SellerProfile)
    private sellerProfileRepo: Repository<SellerProfile>,
  ) {}

  async createStory(userId: string, filePath: string, dto: CreateStoryDto) {
    const sellerProfile = await this.sellerProfileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!sellerProfile) {
      throw new HttpException('Seller profile not found', HttpStatus.NOT_FOUND);
    }

    if (sellerProfile.status !== 'APPROVED') {
      throw new HttpException('Seller is not approved', HttpStatus.FORBIDDEN);
    }

    const story = this.storyRepo.create({
      sellerProfile,
      imagePath: filePath,
      title: dto.title?.trim() || undefined,
      isApproved: false,
    });

    return this.storyRepo.save(story);
  }

  async listApprovedStories() {
    return this.storyRepo.find({
      where: { isApproved: true },
      relations: ['sellerProfile'],
      order: { createdAt: 'DESC' },
    });
  }

  async listStoriesByStatus(status?: string) {
    if (!status) {
      return this.storyRepo.find({
        relations: ['sellerProfile'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.storyRepo.find({
      where: { isApproved: status === 'approved' },
      relations: ['sellerProfile'],
      order: { createdAt: 'DESC' },
    });
  }

  async approveStory(storyId: string) {
    const story = await this.storyRepo.findOne({ where: { id: storyId } });
    if (!story) {
      throw new HttpException('Story not found', HttpStatus.NOT_FOUND);
    }
    story.isApproved = true;
    return this.storyRepo.save(story);
  }
}
