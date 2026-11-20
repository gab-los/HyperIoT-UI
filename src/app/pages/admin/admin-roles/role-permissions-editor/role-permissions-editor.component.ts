import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, computed, inject, input, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs';
import { actionDescription } from '../role-action-descriptions';
import {
  PermissionMasks,
  ResourceAction,
  ResourceActions,
  allActionsMask,
  grantedCount,
  hasAction,
  withAction,
} from '../role-permissions';

/** Bootstrap `md` breakpoint: below it the resource list becomes a select. */
const PHONE_QUERY = '(max-width: 767.98px)';

/**
 * Editor of the permissions of a role: resources on one side, the actions of the selected
 * resource on the other. Edits the masks in place (`[(masks)]`).
 */
@Component({
  selector: 'hyt-role-permissions-editor',
  imports: [MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatListModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-permissions-editor.component.html',
  styleUrl: './role-permissions-editor.component.scss',
})
export class RolePermissionsEditorComponent {
  readonly resources = input.required<ResourceActions[]>();
  readonly masks = model.required<PermissionMasks>();

  protected readonly isPhone = toSignal(
    inject(BreakpointObserver).observe(PHONE_QUERY).pipe(map(state => state.matches)),
    { initialValue: false },
  );

  protected readonly description = actionDescription;

  private readonly selectedName = signal<string | null>(null);

  /** The selected resource; the first one until the user picks another. */
  protected readonly selected = computed(() => {
    const resources = this.resources();
    return resources.find(resource => resource.resourceName === this.selectedName()) ?? resources[0] ?? null;
  });

  protected select(resourceName: string): void {
    this.selectedName.set(resourceName);
  }

  protected maskOf(resource: ResourceActions): number {
    return this.masks()[resource.resourceName] ?? 0;
  }

  protected granted(resource: ResourceActions): number {
    return grantedCount(this.maskOf(resource), resource.actions);
  }

  protected isGranted(resource: ResourceActions, action: ResourceAction): boolean {
    return hasAction(this.maskOf(resource), action.id);
  }

  protected toggle(resource: ResourceActions, action: ResourceAction, granted: boolean): void {
    this.setMask(resource, withAction(this.maskOf(resource), action.id, granted));
  }

  protected selectAll(resource: ResourceActions): void {
    this.setMask(resource, this.maskOf(resource) | allActionsMask(resource.actions));
  }

  protected selectNone(resource: ResourceActions): void {
    this.setMask(resource, this.maskOf(resource) & ~allActionsMask(resource.actions));
  }

  private setMask(resource: ResourceActions, mask: number): void {
    this.masks.update(masks => ({ ...masks, [resource.resourceName]: mask }));
  }
}
