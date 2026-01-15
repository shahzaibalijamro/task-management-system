import { User } from "src/auth/user.entity";
import { Status, Task } from "./task.entity";

// Mock data
export const mockUser: User = {
  id: 'user-id-123',
  username: 'testuser',
  password: 'hashedpassword',
  tasks: [],
} as User;

export const mockTask: Task = {
  id: 'task-id-123',
  title: 'Test Task',
  description: 'Test Description',
  status: Status.OPEN,
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
} as Task;

// Mock tasks array for findAll tests
export const mockTasksArray = [
  { ...mockTask, id: '1', title: 'Task 1' },
  { ...mockTask, id: '2', title: 'Task 2', status: Status.IN_PROGRESS },
  { ...mockTask, id: '3', title: 'Task 3', status: Status.DONE },
];