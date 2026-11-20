import { Routes } from '@angular/router';
import { CanDeactivateGuard } from '../../components/CanDeactivateGuard';
import { adminSectionGuard } from './admin-access.guard';

/** Children of `/admin`. The parent route checks login and access to the admin area. */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent),
  },
  {
    path: 'users',
    canActivate: [adminSectionGuard('users')],
    children: [
      {
        path: '',
        loadComponent: () => import('./admin-users/admin-users.component').then(m => m.AdminUsersComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./admin-users/admin-user-form/admin-user-form.component').then(m => m.AdminUserFormComponent),
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./admin-users/admin-user-form/admin-user-form.component').then(m => m.AdminUserFormComponent),
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
  {
    path: 'roles',
    canActivate: [adminSectionGuard('roles')],
    loadComponent: () => import('./admin-roles/admin-roles.component').then(m => m.AdminRolesComponent),
  },
  {
    path: 'algorithms',
    canActivate: [adminSectionGuard('algorithms')],
    children: [
      {
        path: '',
        loadComponent: () => import('../algorithms/algorithms.component').then(m => m.AlgorithmsComponent),
      },
      {
        path: 'wizard',
        loadComponent: () =>
          import('../algorithms/algorithm-wizard/algorithm-wizard.component').then(m => m.AlgorithmWizardComponent),
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'wizard/:id',
        loadComponent: () =>
          import('../algorithms/algorithm-wizard/algorithm-wizard.component').then(m => m.AlgorithmWizardComponent),
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
];
