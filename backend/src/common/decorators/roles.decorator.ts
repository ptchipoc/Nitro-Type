import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * @Roles(...roles) — restringe rota a utilizadores com role específico.
 *
 * Uso:
 *   @Roles('ADMIN')
 *   @Get('admin-only')
 *   adminOnly() { ... }
 *
 * Nota: Requer RolesGuard aplicado depois do JwtAuthGuard.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
