import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantService } from './tenant.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(
        private readonly tenantService: TenantService,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if the route is marked as @Public()
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const tenantId = request.headers['x-tenant-id'] as string;

        if (!tenantId) {
            throw new ForbiddenException(
                'Missing X-Tenant-ID header. A valid tenant identifier is required.',
            );
        }

        const isValid = await this.tenantService.validateTenant(tenantId);

        if (!isValid) {
            throw new ForbiddenException(
                `Invalid tenant: "${tenantId}". Access denied.`,
            );
        }

        // Attach tenantId to request for downstream use
        request.tenantId = tenantId;

        return true;
    }
}
