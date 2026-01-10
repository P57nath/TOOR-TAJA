import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from './story.entity';
import { SellerProfile } from 'src/sellers/seller-profile.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storyRepo: Repository<Story>,
    @InjectRepository(SellerProfile)
    private sellerProfileRepo: Repository<SellerProfile>,
    private readonly notificationsService: NotificationsService,
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

    const saved = await this.storyRepo.save(story);
    await this.notificationsService.notifyAdmin(
      this.notificationsService.buildPayload(
        'Story submitted',
        `${sellerProfile.storeName} submitted a story for review.`,
        { storyId: saved.id, sellerProfileId: sellerProfile.id },
      ),
    );
    return saved;
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
    const story = await this.storyRepo.findOne({
      where: { id: storyId },
      relations: ['sellerProfile', 'sellerProfile.user'],
    });
    if (!story) {
      throw new HttpException('Story not found', HttpStatus.NOT_FOUND);
    }
    story.isApproved = true;
    const saved = await this.storyRepo.save(story);
    const sellerUserId = story.sellerProfile?.user?.id;
    if (sellerUserId) {
      await this.notificationsService.notifySeller(
        sellerUserId,
        this.notificationsService.buildPayload(
          'Story approved',
          'Your story is approved and now visible to buyers.',
          { storyId: saved.id },
        ),
      );
    }
    return saved;
  }
}
