import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantService {
  /**
   * Validates that the given tenant ID exists and is active.
   * For now, accepts any non-empty string.
   * TODO: Replace with actual DB lookup once tenants table is created.
   */
  async validateTenant(tenantId: string): Promise<boolean> {
    if (!tenantId || tenantId.trim() === '') {
      return false;
    }

    // Placeholder: accept any non-empty tenant ID
    // Future: query the database to check if tenant exists and is active
    return true;
  }
}
