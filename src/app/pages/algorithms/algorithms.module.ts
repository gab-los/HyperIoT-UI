import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AlgorithmsComponent } from './algorithms.component';
import { AlgorithmInfoFormComponent } from './algorithm-forms/algorithm-info-form/algorithm-info-form.component';
import { AlgorithmWizardComponent } from './algorithm-wizard/algorithm-wizard.component';

import { MatChipsModule } from '@angular/material/chips';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { OutputFieldsFormComponent } from './algorithm-forms/output-fields-form/output-fields-form.component';
import { AlgorithmJarFormComponent } from './algorithm-forms/algorithm-jar-form/algorithm-jar-form.component';
import { AlgorithmWizardReportModalComponent } from './algorithm-wizard/algorithm-wizard-report-modal/algorithm-wizard-report-modal.component';
import { InputFieldsFormComponent } from './algorithm-forms/input-fields-form/input-fields-form.component';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatRippleModule} from '@angular/material/core';

@NgModule({
  declarations: [
    AlgorithmsComponent,
    AlgorithmInfoFormComponent,
    AlgorithmWizardComponent,
    OutputFieldsFormComponent,
    AlgorithmJarFormComponent,
    AlgorithmWizardReportModalComponent,
    InputFieldsFormComponent
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatChipsModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatInputModule,
    MatExpansionModule,
    DragDropModule,
    MatListModule
  ]
})
export class AlgorithmsModule { }
