import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appDataSource } from "../dataSource";
import { AUTH_DISABLED } from "../constants";

export class AuthController {
  private static TEST_USER = {
    id: 1,
    username: "admin",
    email: "test@test.com",
    password: "password",
    tasks: [],
  };
  private static SECRET_KEY = "secretkey";

  private static getSignedJwtForUser(user: User) {
    return jwt.sign({ userId: user.id }, this.SECRET_KEY, {
      expiresIn: "1h",
    });
  }

  private static async maybeCreateUser(user: User) {
    const userRepository = appDataSource.getRepository(User);
    const maybeUser = await userRepository.findOneBy({ id: user.id });

    if (!maybeUser) {
      const newUser = userRepository.create({ ...user });
      await userRepository.save(newUser);
      return newUser;
    }

    return maybeUser;
  }

  public static async authenticateRequest(
    req: Request,
    res: Response,
    next: Function
  ) {
    if (AUTH_DISABLED) {
      const user = await AuthController.maybeCreateUser(
        AuthController.TEST_USER
      );
      res.locals.userId = user.id.toString();
      return next();
    }

    const token = req.cookies["token"];
    if (!token) {
      return res.redirect("/login");
    }

    try {
      const decoded = jwt.verify(token, AuthController.SECRET_KEY);
      res.locals.userId =
        typeof decoded === "string" ? decoded : decoded.userId.toString();
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        AuthController.logout(req, res);
      } else {
        console.log(`Error logging in: ${error}`);
        return res
          .status(401)
          .send({ error: "Authentication error: Invalid token" });
      }
    }
  }

  private static handleSuccessfulLogin(res: Response, user: User) {
    const token = AuthController.getSignedJwtForUser(user);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect("/");
  }

  static async signup(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const userRepository = appDataSource.getRepository(User);
    const userExists = await userRepository.findOneBy({
      email,
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    AuthController.handleSuccessfulLogin(res, user);
  }

  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const userRepository = appDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { username },
      select: ["id", "password"],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ Task: "Invalid credentials" });
    }

    AuthController.handleSuccessfulLogin(res, user);
  }

  static async logout(_: Request, res: Response) {
    res.clearCookie("token");
    res.redirect("/login");
  }
}
