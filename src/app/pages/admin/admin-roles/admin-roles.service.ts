import { HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IGNORE_ERROR_NOTIFY, Role, RolesService } from 'core';

/** Access to the roles of the platform for the admin area. */
@Injectable({ providedIn: 'root' })
export class AdminRolesService {
  private readonly rolesService = inject(RolesService);

  /** All the roles. Errors are not notified by the HTTP interceptor: the page shows them. */
  findAll(): Observable<Role[]> {
    const context = new HttpContext().set(IGNORE_ERROR_NOTIFY, true);
    return this.rolesService.findAllRoles('body', false, context).pipe(
      map((roles: unknown) => (Array.isArray(roles) ? (roles as Role[]) : [])),
    );
  }
}
