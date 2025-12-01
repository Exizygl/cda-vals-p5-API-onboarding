import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(token: string): Promise<{ authenticated: boolean }> {
    const validToken = this.configService.get<string>('API_TOKEN');

    if (!validToken) {
      throw new UnauthorizedException('API_TOKEN not configured');
    }

    if (token !== validToken) {
      throw new UnauthorizedException('Invalid API token');
    }

    return await Promise.resolve({ authenticated: true });
  }
}
