import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminPageHeaderComponent, BreadcrumbItem } from '../admin-page-header/admin-page-header.component';

/** Role management. Placeholder until the section is implemented. */
@Component({
  selector: 'hyt-admin-roles',
  imports: [AdminPageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-page">
      <hyt-admin-page-header [items]="breadcrumb" />
      <h1 class="admin-title" i18n="@@HYT_admin_roles">Roles</h1>
      <p i18n="@@HYT_admin_section_coming_soon">This section is under construction.</p>
    </div>
  `,
  styles: `
    .admin-page {
      padding: 15px;
    }

    .admin-title {
      font-size: 1.5em;
      margin: 24px 0 16px;
    }
  `,
})
export class AdminRolesComponent {
  protected readonly breadcrumb: BreadcrumbItem[] = [
    { label: $localize`:@@HYT_admin:Admin`, link: '/admin' },
    { label: $localize`:@@HYT_admin_roles:Roles` },
  ];
}
