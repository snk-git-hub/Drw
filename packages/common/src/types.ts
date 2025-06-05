import {z} from 'zod';
const Creaateuserschema = z.object({
    email: z.string().email('invalid email format'),
    password: z.string().min(5, 'Password must have least 5 charecters'),
    name: z.string().min(3)
})
const Signinschema = z.object({
    email: z.string().email('invalid wmail format'),
    password: z.string().min(5, 'password mush have least 5 charecters ')
})
const CreateRoom = z.object({
    name: z.string().min(5).max(5)
})
export {Creaateuserschema, Signinschema, CreateRoom}