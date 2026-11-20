import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

/** A Material 3 color role, shown as a swatch with its "on" color as text. */
interface ColorRole {
  name: string;
  background: string;
  foreground: string;
}

interface DeviceRow {
  device: string;
  packet: string;
  status: string;
}

/**
 * Development page that shows the main Angular Material components with the HyperIoT theme,
 * to check colors and shapes while the theme is being reworked.
 * It is registered only in non-production builds, so its texts are not translated.
 */
@Component({
  selector: 'hyt-theme-preview',
  templateUrl: './theme-preview.component.html',
  styleUrl: './theme-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
  ],
})
export class ThemePreviewComponent {
  readonly colorRoles: readonly ColorRole[] = [
    { name: 'primary', background: 'var(--mat-sys-primary)', foreground: 'var(--mat-sys-on-primary)' },
    { name: 'primary-container', background: 'var(--mat-sys-primary-container)', foreground: 'var(--mat-sys-on-primary-container)' },
    { name: 'secondary', background: 'var(--mat-sys-secondary)', foreground: 'var(--mat-sys-on-secondary)' },
    { name: 'secondary-container', background: 'var(--mat-sys-secondary-container)', foreground: 'var(--mat-sys-on-secondary-container)' },
    { name: 'tertiary', background: 'var(--mat-sys-tertiary)', foreground: 'var(--mat-sys-on-tertiary)' },
    { name: 'tertiary-container', background: 'var(--mat-sys-tertiary-container)', foreground: 'var(--mat-sys-on-tertiary-container)' },
    { name: 'error', background: 'var(--mat-sys-error)', foreground: 'var(--mat-sys-on-error)' },
    { name: 'error-container', background: 'var(--mat-sys-error-container)', foreground: 'var(--mat-sys-on-error-container)' },
    { name: 'surface', background: 'var(--mat-sys-surface)', foreground: 'var(--mat-sys-on-surface)' },
    { name: 'surface-variant', background: 'var(--mat-sys-surface-variant)', foreground: 'var(--mat-sys-on-surface-variant)' },
    { name: 'surface-container', background: 'var(--mat-sys-surface-container)', foreground: 'var(--mat-sys-on-surface)' },
    { name: 'surface-container-highest', background: 'var(--mat-sys-surface-container-highest)', foreground: 'var(--mat-sys-on-surface)' },
    { name: 'inverse-surface', background: 'var(--mat-sys-inverse-surface)', foreground: 'var(--mat-sys-inverse-on-surface)' },
    { name: 'outline', background: 'var(--mat-sys-outline)', foreground: 'var(--mat-sys-surface)' },
  ];

  readonly devices = ['Boiler room sensor', 'Main gateway', 'Cold storage probe'];
  readonly packets = ['Temperature', 'Humidity', 'Pressure', 'Voltage', 'Current'];

  readonly tableColumns = ['device', 'packet', 'status'];
  readonly tableRows: readonly DeviceRow[] = [
    { device: 'Boiler room sensor', packet: 'Temperature', status: 'Online' },
    { device: 'Main gateway', packet: 'Voltage', status: 'Offline' },
    { device: 'Cold storage probe', packet: 'Humidity', status: 'Online' },
  ];

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    device: new FormControl<string | null>(null),
    packets: new FormControl<string[]>(['Temperature'], { nonNullable: true }),
    tag: new FormControl('', { nonNullable: true }),
    date: new FormControl<Date | null>(null),
    readOnly: new FormControl({ value: 'Disabled field', disabled: true }, { nonNullable: true }),
    notifications: new FormControl(true, { nonNullable: true }),
    archived: new FormControl(false, { nonNullable: true }),
    level: new FormControl('warning', { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
    threshold: new FormControl(40, { nonNullable: true }),
  });

  private readonly tagValue = toSignal(this.form.controls.tag.valueChanges, { initialValue: '' });

  readonly filteredPackets = computed(() => {
    const query = this.tagValue().toLowerCase();
    return this.packets.filter((packet) => packet.toLowerCase().includes(query));
  });

  constructor() {
    // Shows the error state of a form field from the start.
    this.form.controls.name.markAsTouched();
  }
}
