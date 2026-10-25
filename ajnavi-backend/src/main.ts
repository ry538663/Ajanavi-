import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const port = config.get<number>("PORT", 4000);
  await app.listen(port, "0.0.0.0");
  console.log(`Ajnavi API listening on http://0.0.0.0:${port}`);
}
bootstrap();
