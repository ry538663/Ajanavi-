import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";
import { MailService } from "../mail/mail.service";
import { LoginDto } from "./dto/login.dto";
import { User } from "../entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Req() req: Request) {
    const cleanEmail = body.email.trim().toLowerCase();

    // Only allow login if user has signed up previously
    const user = await this.userRepo.findOne({ where: { email: cleanEmail } });
    if (!user) {
      throw new HttpException(
        {
          success: false,
          message: "No account found with this email. Please sign up first.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const notification = await this.mailService.sendLoginAlert(cleanEmail, ip).catch((err) => {
      console.warn("Mail error:", err?.message);
      return { sent: false, error: err?.message };
    });

    return {
      success: true,
      email: user.email,
      profile: {
        name: user.name,
        gender: user.gender,
        country: user.country,
        bio: user.bio,
        interests: user.interests,
        over18: user.over18,
      },
      notification,
    };
  }

  @Post("signup")
  @HttpCode(HttpStatus.OK)
  async signup(@Body() body: LoginDto, @Req() req: Request) {
    const cleanEmail = body.email.trim().toLowerCase();

    // Check if account already exists
    const existing = await this.userRepo.findOne({ where: { email: cleanEmail } });
    if (existing) {
      throw new HttpException(
        {
          success: false,
          message: "This email is already registered. Please log in instead.",
          alreadyRegistered: true,
        },
        HttpStatus.CONFLICT,
      );
    }

    const defaultName = cleanEmail.split("@")[0] || "Stranger";
    const newUser = this.userRepo.create({
      email: cleanEmail,
      name: defaultName,
      gender: "prefer-not-to-say",
      country: "India",
      bio: "",
      interests: ["Music", "Tech"],
      over18: true,
    });
    const saved = await this.userRepo.save(newUser);

    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const notification = await this.mailService.sendLoginAlert(cleanEmail, ip, true).catch((err) => {
      console.warn("Mail error on signup:", err?.message);
      return { sent: false, error: err?.message };
    });

    return {
      success: true,
      email: saved.email,
      profile: {
        name: saved.name,
        gender: saved.gender,
        country: saved.country,
        bio: saved.bio,
        interests: saved.interests,
        over18: saved.over18,
      },
      notification,
      message: "Account created successfully.",
    };
  }

  @Post("profile")
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body()
    body: {
      email: string;
      name?: string;
      gender?: string;
      country?: string;
      bio?: string;
      interests?: string[];
      over18?: boolean;
    },
  ) {
    const cleanEmail = body.email.trim().toLowerCase();
    let user = await this.userRepo.findOne({ where: { email: cleanEmail } });
    if (!user) {
      user = this.userRepo.create({
        email: cleanEmail,
        name: body.name || cleanEmail.split("@")[0],
        gender: body.gender || "prefer-not-to-say",
        country: body.country || "India",
        bio: body.bio || "",
        interests: body.interests || ["Music", "Tech"],
        over18: body.over18 ?? true,
      });
    } else {
      if (body.name !== undefined) user.name = body.name;
      if (body.gender !== undefined) user.gender = body.gender;
      if (body.country !== undefined) user.country = body.country;
      if (body.bio !== undefined) user.bio = body.bio;
      if (body.interests !== undefined) user.interests = body.interests;
      if (body.over18 !== undefined) user.over18 = body.over18;
    }
    const saved = await this.userRepo.save(user);

    return {
      success: true,
      email: saved.email,
      profile: {
        name: saved.name,
        gender: saved.gender,
        country: saved.country,
        bio: saved.bio,
        interests: saved.interests,
        over18: saved.over18,
      },
    };
  }
}
