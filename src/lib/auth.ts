import { dbOperations } from './db';
import { crypto } from './crypto';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  email: z.string().email(),
});

const updateProfileSchema = z.object({
  currentUsername: z.string(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  currentPassword: z.string(),
  newPassword: z.string().optional(),
});

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterData = {
  username: string;
  password: string;
  email: string;
};

export type UpdateProfileData = {
  currentUsername: string;
  username: string;
  email: string;
  currentPassword: string;
  newPassword?: string;
};

export const auth = {
  async login(credentials: LoginCredentials) {
    try {
      const db = await dbOperations.getDB();
      const user = await db.get('users', credentials.username);
      
      if (!user) return null;

      const isValidPassword = await crypto.verifyPassword(
        credentials.password,
        user.password
      );

      if (!isValidPassword) return null;

      const token = await crypto.generateToken({
        username: user.username,
        email: user.email
      });

      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  async register(data: RegisterData) {
    const validation = userSchema.safeParse(data);
    if (!validation.success) {
      throw new Error('Invalid registration data');
    }

    try {
      const hashedPassword = await crypto.hashPassword(data.password);
      const db = await dbOperations.getDB();
      
      await db.add('users', {
        ...data,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'ConstraintError') {
        throw new Error('Username or email already exists');
      }
      throw new Error('Registration failed');
    }
  },

  async updateProfile(data: UpdateProfileData) {
    const validation = updateProfileSchema.safeParse(data);
    if (!validation.success) {
      throw new Error('Invalid profile data');
    }

    try {
      const db = await dbOperations.getDB();
      const user = await db.get('users', data.currentUsername);
      
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await crypto.verifyPassword(
        data.currentPassword,
        user.password
      );

      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Check if new username already exists (if changing username)
      if (data.username !== data.currentUsername) {
        const existingUser = await db.get('users', data.username);
        if (existingUser) {
          throw new Error('Username already taken');
        }
      }

      const updates = {
        ...user,
        username: data.username,
        email: data.email,
      };

      if (data.newPassword) {
        updates.password = await crypto.hashPassword(data.newPassword);
      }

      // Delete old username entry if username is changing
      if (data.username !== data.currentUsername) {
        await db.delete('users', data.currentUsername);
      }

      // Add new entry
      await db.add('users', updates);

      const token = await crypto.generateToken({
        username: updates.username,
        email: updates.email
      });

      const { password, ...userWithoutPassword } = updates;
      return {
        ...userWithoutPassword,
        token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update profile');
    }
  },

  async verifySession(token: string) {
    try {
      const payload = await crypto.verifyToken(token);
      if (!payload) return null;

      const db = await dbOperations.getDB();
      const user = await db.get('users', payload.username);
      if (!user) return null;

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Session verification error:', error);
      return null;
    }
  }
};