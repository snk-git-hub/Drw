import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());
app.use(cors());

// /signup route
app.post("/signup", async (req: Request, res: Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }

    const { email, password, name } = parsedData.data;

    try {
        const user = await prismaClient.user.create({
            data: {
                email,
                password, //  TODO: hash before production
                name
            }
        });

        res.json({ userId: user.id });
    } catch (e) {
        res.status(409).json({ message: "User already exists with this email" });
    }
});

// /signin route
app.post("/signin", async (req: Request, res: Response) => {
    const parsedData = SigninSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }

    const { email, password } = parsedData.data;

    const user = await prismaClient.user.findFirst({
        where: {
            email,
            password //  TODO: compare hashed password
        }
    });

    if (!user) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({ token });
});

// /room route
app.post("/room", middleware, async (req: Request, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }

    // @ts-ignore
    const userId = req.userId;

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

// /chats/:roomId
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

// /room/:slug
app.get("/room/:slug", async (req: Request, res: Response) => {
    const slug = req.params.slug;

    const room = await prismaClient.room.findFirst({
        where: { slug }
    });

    res.json({ room });
});

app.listen(3001, () => {
    console.log("http-backend running on port 3001");
});
