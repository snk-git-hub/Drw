import { z } from 'zod';

const CreateUserSchema = z.object({
    email: z.string().email('invalid email format'),
    password: z.string().min(5, 'Password must have at least 5 characters'),
    name: z.string().min(3)
});

const SigninSchema = z.object({
    email: z.string().email('invalid email format'),
    password: z.string().min(5, 'Password must have at least 5 characters')
});

const CreateRoomSchema = z.object({
    name: z.string().min(5).max(5)
});

export { CreateUserSchema, SigninSchema, CreateRoomSchema };
