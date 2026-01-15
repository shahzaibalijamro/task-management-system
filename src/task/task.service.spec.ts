import { getRepositoryToken } from '@nestjs/typeorm';
import { Status, Task } from './task.entity';
import { TaskService } from './task.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mockTask, mockTasksArray, mockUser } from './mock.task';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('Tasks Service', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockTaskRepository = {
    // Mock methods will be defined in each test
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
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

      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalledWith(
        'task',
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.userId = :id',
        { id: mockUser.id },
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockTasksArray);
    });

    it('should filter tasks by Status', async () => {
      const filters = {
        status: Status.IN_PROGRESS,
      };
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockTasksArray[1]),
      };
      mockTaskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(filters, mockUser);
      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalledWith(
        'task',
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'task.userId = :id',
        { id: mockUser.id },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'task.status = :status',
        { status: Status.IN_PROGRESS },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockTasksArray[1]);
    });

    it('should filter tasks by title or description', async () => {
      const filters = {
        search: 'Task 2',
      };
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockTasksArray[1]),
      };
      mockTaskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(filters, mockUser);
      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalledWith(
        'task',
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'task.userId = :id',
        { id: mockUser.id },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
        { search: `%${'Task 2'.toLowerCase()}%` },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockTasksArray[1]);
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
      await expect(service.findTaskById(id, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findTaskById(id, mockUser)).rejects.toThrow(
        `Task with id ${id} not found!`,
      );
    });
  });

  describe('Create Task method', () => {
    const body = {
      title: 'some task',
      description: 'some description',
    };
    it('should create new task and return it', async () => {
      mockTaskRepository.save.mockResolvedValue(mockTask);
      const result = await service.createNewTask(body, mockUser);
      expect(mockTaskRepository.save).toHaveBeenCalledWith({
        title: 'some task',
        description: 'some description',
        status: Status.OPEN,
        user: mockUser,
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('Remove task by Id method', () => {
    const id = 'task-id-123';
    it('should delete the task by id and then return it', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      const result = await service.removeTaskById(id, mockUser);
      expect(mockTaskRepository.remove).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.remove).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });
  });


  describe("Update Task By Id method", () => {
    const id = 'task-id-123';

    it("should update task status by Id", async () => {
        mockTaskRepository.findOne.mockResolvedValue(mockTask);
        const result = await service.updateTaskById({status: Status.DONE}, id, mockUser);
        expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
            where: {
                id,
                user: mockUser,
            }
        });
        expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask);
        expect(result).toEqual(mockTask);
    })
  })
});