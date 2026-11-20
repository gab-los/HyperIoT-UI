import { HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HUser, HUserService, IGNORE_ERROR_NOTIFY } from 'core';

/** Access to the users of the platform for the admin area. */
@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private readonly hUserService = inject(HUserService);

  /**
   * All the users. Errors are not notified by the HTTP interceptor:
   * the page shows its own error state.
   */
  findAll(): Observable<HUser[]> {
    const context = new HttpContext().set(IGNORE_ERROR_NOTIFY, true);
    return this.hUserService.findAllHUser('body', false, context).pipe(
      map((users: unknown) => (Array.isArray(users) ? (users as HUser[]) : [])),
    );
  }

  delete(id: number): Observable<void> {
    return this.hUserService.deleteHUser(id).pipe(map(() => undefined));
  }

  /** Id of the logged user, from `user` in localStorage. */
  currentUserId(): number | null {
    const raw = localStorage.getItem('user');
    if (!raw) {
      return null;
    }
    try {
      const id = (JSON.parse(raw) as { id?: unknown }).id;
      return typeof id === 'number' ? id : null;
    } catch {
      return null;
    }
  }
}
