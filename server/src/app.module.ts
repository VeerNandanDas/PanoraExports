import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { VerificationModule } from './verification/verification.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate Limiting
        ThrottlerModule.forRoot([{
            ttl: 60000, // 1 minute
            limit: 10,  // 10 requests per minute
        }]),

        // Core Database & Storage
        PrismaModule,
        SupabaseModule,

        // Feature Modules
        VerificationModule,
    ],
})
export class AppModule { }

