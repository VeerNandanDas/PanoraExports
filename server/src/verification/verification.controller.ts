import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VerificationService, VerificationResult } from './verification.service';

class VerifyBusinessDto {
    country: string;
    businessId: string;
}

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
    private readonly logger = new Logger(VerificationController.name);

    constructor(private readonly verificationService: VerificationService) { }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verify business registration',
        description: 'Verify business registration number for various countries including India (GST), EU (VAT), USA (EIN), UK, UAE, Canada, and Australia'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                country: {
                    type: 'string',
                    example: 'INDIA',
                    description: 'Country name (INDIA, USA, UK, UAE, GERMANY, FRANCE, etc.)'
                },
                businessId: {
                    type: 'string',
                    example: '22AAAAA0000A1Z5',
                    description: 'Business registration number (GST, VAT, EIN, etc.)'
                }
            },
            required: ['country', 'businessId']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Verification result',
        schema: {
            type: 'object',
            properties: {
                verified: { type: 'boolean' },
                country: { type: 'string' },
                businessName: { type: 'string', nullable: true },
                verificationType: { type: 'string' },
                reason: { type: 'string', nullable: true },
                note: { type: 'string', nullable: true },
                nextStep: { type: 'string', nullable: true }
            }
        }
    })
    async verifyBusiness(@Body() dto: VerifyBusinessDto): Promise<VerificationResult> {
        this.logger.log(`Verification request: ${dto.country} - ${dto.businessId}`);
        return this.verificationService.verifyBusiness(dto.country, dto.businessId);
    }

    @Post('check-format')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Check business ID format',
        description: 'Quick format validation without external API calls'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                country: { type: 'string', example: 'INDIA' },
                businessId: { type: 'string', example: '22AAAAA0000A1Z5' }
            }
        }
    })
    async checkFormat(@Body() dto: VerifyBusinessDto): Promise<{ valid: boolean; format: string; example: string }> {
        const formats = {
            INDIA: { format: '15 characters: 2 digits + 10 alphanumeric + 1 letter + 1 alphanumeric + Z + 1 alphanumeric', example: '22AAAAA0000A1Z5' },
            USA: { format: '9 digits with hyphen: XX-XXXXXXX', example: '12-3456789' },
            UK: { format: '8 alphanumeric characters', example: 'AB123456' },
            UAE: { format: 'Minimum 6 digits', example: '123456' },
            CANADA: { format: '9 digits', example: '123456789' },
            AUSTRALIA: { format: '11 digits', example: '12345678901' },
            EU: { format: '2-letter country code + 8-12 digits', example: 'DE123456789' },
        };

        const countryUpper = dto.country.toUpperCase();
        const formatInfo = formats[countryUpper] || formats.EU;

        // Simple format check
        let valid = false;
        if (countryUpper === 'INDIA') {
            valid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(dto.businessId);
        } else if (countryUpper === 'USA') {
            valid = /^\d{2}-\d{7}$/.test(dto.businessId);
        } else if (countryUpper === 'UK') {
            valid = /^[A-Z0-9]{8}$/.test(dto.businessId);
        } else if (countryUpper === 'UAE') {
            valid = dto.businessId.length >= 6 && /^[0-9]+$/.test(dto.businessId);
        } else if (countryUpper === 'CANADA') {
            valid = /^\d{9}$/.test(dto.businessId);
        } else if (countryUpper === 'AUSTRALIA') {
            valid = /^\d{11}$/.test(dto.businessId.replace(/\s/g, ''));
        }

        return {
            valid,
            format: formatInfo.format,
            example: formatInfo.example
        };
    }
}
