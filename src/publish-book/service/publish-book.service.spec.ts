import { Test, TestingModule } from '@nestjs/testing';
import { PublishBookService } from './publish-book.service';

describe('PublishBookService', () => {
  let service: PublishBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishBookService],
    }).compile();

    service = module.get<PublishBookService>(PublishBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
