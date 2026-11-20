import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAccessService, AdminSectionId } from './admin-access.service';

/** Lets in users who can use at least one section of the admin area. */
export const adminAreaGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AdminAccessService).canAccessAdminArea() || router.createUrlTree(['/notFound']);
};

/** Lets in users who can use the given section of the admin area. */
export function adminSectionGuard(section: AdminSectionId): CanActivateFn {
  return () => {
    const router = inject(Router);
    return inject(AdminAccessService).canAccessSection(section) || router.createUrlTree(['/notFound']);
  };
}
