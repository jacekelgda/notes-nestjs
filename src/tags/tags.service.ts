import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { RedisClientService } from '../redis-client/redis-client.service';
import { Repository } from 'redis-om';
import { TagSchema } from './entities/tag.entity';

@Injectable()
export class TagsService implements OnModuleInit {
  private tagsReposiotry: Repository;

  constructor(
    @Inject(RedisClientService)
    private readonly redisClient: RedisClientService,
  ) {}

  async onModuleInit() {
    await this.redisClient.open();
    this.tagsReposiotry = await this.redisClient.fetchRepository(TagSchema);
    await this.tagsReposiotry.createIndex();
  }

  create(createTagDto: CreateTagDto) {
    return this.tagsReposiotry.save({ name: createTagDto.name });
  }

  findAll() {
    return this.tagsReposiotry.search().return.all();
  }
}
