import { prisma } from "../../db";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token";


export interface AuthReq extends Request{
    userId?: string;
}
export const signup = async (req: AuthReq, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  const exitingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (exitingUser) {
    res.status(401).json({
      message: "User already exit",
    });
    return;
  }

  const hashpass = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password:hashpass, name },
  });

  const token = generateToken(user.id);

  res.status(201).json({
    message: "User CReated Successfully",
    name,
    token,
  });
};

export const login = async(req: Request, res: Response) => {
    const {email,password}=req.body
      if ( !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = generateToken(user.id);

  res.status(201).json({
    token,
    email,
    message:"User Login Sucessfull"
  })
};

export const me = async(req: AuthReq, res: Response) => {
    const userId=req.userId;

    if (!userId){
        res.status(409).json({
            message:"User not authenticated"
        })
        return;
    }

    const user = await prisma.user.findFirst({
        where:{id:userId},
        select:{ name: true, email: true }
    })

    res.status(200).json({ user })

};
