import { Controller, Get } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MatchService } from "./chat/match.service";
import { Session } from "./entities/session.entity";
import { Report } from "./entities/report.entity";

@Controller()
export class AppController {
  constructor(
    private readonly matches: MatchService,
    @InjectRepository(Session) private readonly sessionRepo: Repository<Session>,
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
  ) {}

  @Get("health")
  async health() {
    let totalSessions = 0;
    let totalReports = 0;
    let dbStatus = "connected";

    try {
      totalSessions = await this.sessionRepo.count();
      totalReports = await this.reportRepo.count();
    } catch {
      dbStatus = "disconnected";
    }

    const isNeon = Boolean(process.env.DATABASE_URL?.includes("neon.tech"));

    return {
      status: "ok",
      service: "ajnavi-api",
      database: dbStatus,
      databaseProvider: isNeon ? "Neon Serverless Postgres" : "Local Postgres",
      neonBranch: process.env.NEON_BRANCH || (isNeon ? "production" : null),
      totalSessions,
      totalReports,
      ...this.matches.stats(),
      timestamp: new Date().toISOString(),
    };
  }
}


