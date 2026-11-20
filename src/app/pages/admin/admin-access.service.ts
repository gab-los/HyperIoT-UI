import { Injectable } from '@angular/core';

/** Sub-areas of the admin area. */
export type AdminSectionId = 'users' | 'roles' | 'algorithms';

export const ADMIN_SECTION_IDS: readonly AdminSectionId[] = ['users', 'roles', 'algorithms'];

/**
 * Back-end resource checked for each section: a user who is not admin can open a section
 * only with the `control_panel` permission on its resource (same rule as the old algorithms page).
 */
export const ADMIN_SECTION_RESOURCES: Readonly<Record<AdminSectionId, string>> = {
  users: 'it.acsoftware.hyperiot.huser.model.HUser',
  roles: 'it.acsoftware.hyperiot.role.model.Role',
  algorithms: 'it.acsoftware.hyperiot.algorithm.model.Algorithm',
};

const CONTROL_PANEL_ACTION = 'control_panel';

interface StoredUserInfo {
  authenticable?: { admin?: boolean };
  profile?: Record<string, { permissions?: string[] } | undefined>;
}

/** Tells which parts of the admin area the logged user can use, from `userInfo` in localStorage. */
@Injectable({ providedIn: 'root' })
export class AdminAccessService {

  canAccessSection(section: AdminSectionId): boolean {
    const userInfo = this.readUserInfo();
    if (!userInfo) {
      return false;
    }
    if (userInfo.authenticable?.admin) {
      return true;
    }
    const permissions = userInfo.profile?.[ADMIN_SECTION_RESOURCES[section]]?.permissions ?? [];
    return permissions.includes(CONTROL_PANEL_ACTION);
  }

  accessibleSections(): AdminSectionId[] {
    return ADMIN_SECTION_IDS.filter(section => this.canAccessSection(section));
  }

  canAccessAdminArea(): boolean {
    return this.accessibleSections().length > 0;
  }

  private readUserInfo(): StoredUserInfo | null {
    const raw = localStorage.getItem('userInfo');
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as StoredUserInfo;
    } catch {
      return null;
    }
  }
}
