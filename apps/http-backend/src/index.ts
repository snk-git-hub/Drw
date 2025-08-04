import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { verify } from "jsonwebtoken";
import cors from "cors";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','http://localhost:3002'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
 
app.post("/signup", async (req: Request, res: Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }

    const { email, password, name } = parsedData.data;
   
    try {
        const hash_pass= await bcrypt.hash(password,10);
        const user = await prismaClient.user.create({
            data: {
                email,
                password:hash_pass, 
                name
            }
        });

        res.json({ userId: user.id });
    } catch (err) {
  console.error("Signup error:", err);  
  res.status(500).json({ message: "internal server error" });

}
});

app.post("/signin", async (req: Request, res: Response) => {
    const parsedData = SigninSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }

    const { email, password } = parsedData.data;

   
    try{
    const user = await prismaClient.user.findFirst({
        where: {
            email,
            
        }
    });

    if (!user) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }
  const decoded_pass= await bcrypt.compare(password,user.password);
if(!decoded_pass){
    res.status(403).json({
        message:"Invalid credentials"
    });
    return;
}
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({ token });
}
catch(err){
console.error("signin error:",err);
res.status(500).json({message:"internal server error"});
}
});








app.post("/room", middleware, async (req: Request, res: Response) => {
        console.log("Request body:", req.body); 

    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.log("Validation error:", parsedData.error); 
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }

    // @ts-ignore
    const userId = req.userId;

if (!userId) {
  return res.status(401).json({ message: "Unauthorized: No userId in request" });
}
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        });

        res.json({ roomId: room.id });
    } catch (e) {
        res.status(409).json({ message: "Room already exists with this name" });
    }
});






app.get("/chats/:roomId", async (req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.roomId);

        const messages = await prismaClient.chat.findMany({
            where: { roomId },
            orderBy: { id: "desc" },
            take: 1000
        });

        res.json({ messages });
    } catch (e) {
        console.log(e);
        res.json({ messages: [] });
    }
});

app.get("/room/:slug", async (req: Request, res: Response) => {
    const slug = req.params.slug;

    const room = await prismaClient.room.findFirst({
        where: { slug }
    });

    res.json({ room });
});

app.post("/verify-token", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ valid: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ valid: true, payload: decoded });
  } catch (error) {
    return res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});



app.listen(3001, () => {
    console.log("http-backend running on port 3001");
});
