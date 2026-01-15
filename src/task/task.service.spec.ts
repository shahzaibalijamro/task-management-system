import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mockTasksArray, mockUser } from './mock.task';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('Tasks Service', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockTaskRepository = {
    // Mock methods will be defined in each test
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();
    service = module.get(TaskService);
    repository = module.get(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clean up mocks after each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findAll method', () => {
    it('should return all tasks for user without filters', async () => {
      const filters = {};
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockTasksArray),
      };
      mockTaskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(filters, mockUser);
      expect(result).toEqual(mockTasksArray);
    });
  });

  describe('findTaskById method', () => {
    const id = '1';
    it('should fetch task by Id', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTasksArray[0]);
      const result = await service.findTaskById(id, mockUser);
      expect(result).toEqual(mockTasksArray[0]);
    });
    it('should throw NotFoundException when task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);
      await expect(service.findTaskById(id, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
