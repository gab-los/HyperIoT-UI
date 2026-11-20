import { TestBed } from '@angular/core/testing';
import { ADMIN_SECTION_RESOURCES, AdminAccessService } from './admin-access.service';

function setUserInfo(userInfo: unknown): void {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

describe('AdminAccessService', () => {
  let service: AdminAccessService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(AdminAccessService);
  });

  afterEach(() => localStorage.clear());

  it('denies everything without userInfo', () => {
    expect(service.canAccessAdminArea()).toBe(false);
    expect(service.accessibleSections()).toEqual([]);
  });

  it('denies everything when userInfo is not valid JSON', () => {
    localStorage.setItem('userInfo', '{not json');
    expect(service.canAccessAdminArea()).toBe(false);
  });

  it('gives an admin access to every section', () => {
    setUserInfo({ authenticable: { admin: true }, profile: {} });
    expect(service.accessibleSections()).toEqual(['users', 'roles', 'algorithms']);
    expect(service.canAccessAdminArea()).toBe(true);
  });

  it('gives a non-admin only the sections with the control_panel permission', () => {
    setUserInfo({
      authenticable: { admin: false },
      profile: {
        [ADMIN_SECTION_RESOURCES.algorithms]: { permissions: ['control_panel'] },
        [ADMIN_SECTION_RESOURCES.users]: { permissions: ['find'] },
      },
    });
    expect(service.accessibleSections()).toEqual(['algorithms']);
    expect(service.canAccessSection('users')).toBe(false);
    expect(service.canAccessAdminArea()).toBe(true);
  });

  it('denies the admin area to a non-admin without control_panel permissions', () => {
    setUserInfo({ authenticable: { admin: false }, profile: {} });
    expect(service.canAccessAdminArea()).toBe(false);
  });
});
