
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserService } from '../services/user.service.js';

const validRoles = ['analyst', 'senior_analyst', 'admin'];

export class UserController {
  // GET /api/users
  public static async getAllUsers(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id
  public static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Analyst not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users
  public static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      if (
        typeof name !== 'string' ||
        !name.trim() ||
        typeof email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        typeof password !== 'string' ||
        password.length < 8 ||
        !validRoles.includes(role)
      ) {
        res.status(400).json({
          success: false,
          message:
            'Invalid data. Provide a name, valid email, password of at least 8 characters, and valid role.',
        });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await UserService.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'Analyst created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

