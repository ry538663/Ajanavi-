import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthController } from "./auth/auth.controller";
import { ChatGateway } from "./chat/chat.gateway";
import { MatchService } from "./chat/match.service";
import { MailService } from "./mail/mail.service";
import { Report } from "./entities/report.entity";
import { Session } from "./entities/session.entity";
import { User } from "./entities/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../.env.local", "../.env"],
    }),
    TypeOrmModule.forRootAsync({

      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>("DATABASE_URL");
        if (databaseUrl) {
          return {
            type: "postgres",
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities: [Report, Session, User],
            synchronize: true,
          };
        }
        return {
          type: "postgres",
          host: config.get<string>("DB_HOST", "localhost"),
          port: Number(config.get<number>("DB_PORT", 5432)),
          username: config.get<string>("DB_USERNAME", "rohityadav"),
          password: config.get<string>("DB_PASSWORD", ""),
          database: config.get<string>("DB_NAME", "ajnavi_db"),
          entities: [Report, Session, User],
          synchronize: true,
        };
      },

    }),
    TypeOrmModule.forFeature([Report, Session, User]),
  ],
  controllers: [AppController, AuthController],
  providers: [ChatGateway, MatchService, MailService],
})
export class AppModule {}


