import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOneAndUpdate({ clerkId }, { $setOnInsert: { clerkId, name, email, avatar: clerkUser.imageUrl } }, { upsert: true, new: true });

    if (!user) {
      // get user info from clerk and save to db
      const clerkUser = await clerkClient.users.getUser(clerkId);

      const name = clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.primaryPhoneNumber || "Unnamed User";
      const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkId}@no-email.local`;
      if (!email) {
        throw new Error('Email is required for user creation.');
      }
      user = await User.findOneAndUpdate({ clerkId }, { $setOnInsert: { clerkId, name, email, avatar: clerkUser.imageUrl } }, { upsert: true, new: true });
    }

    res.json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}