import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Security
    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    // CORS - Allow all origins for development
    app.enableCors({
        origin: true,
        credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix('api');

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Swagger API Documentation
    const config = new DocumentBuilder()
        .setTitle('Panora Exports API')
        .setDescription('Complete B2B Import-Export Platform API Documentation')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('verification', 'Buyer verification (GST & International)')
        .addTag('products', 'Product catalog')
        .addTag('categories', 'Product categories')
        .addTag('rfq', 'Request for Quotation')
        .addTag('orders', 'Order management')
        .addTag('dashboard', 'Dashboard analytics')
        .addTag('uploads', 'File uploads')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Start server
    const port = configService.get<number>('PORT', 3001);
    await app.listen(port);

    console.log(`\n🚀 Panora Exports API is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs\n`);
}

bootstrap();
