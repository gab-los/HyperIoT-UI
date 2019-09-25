import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WidgetsLayoutComponent } from '../widgets-layout/widgets-layout.component';
import { AddWidgetDialogComponent } from '../add-widget-dialog/add-widget-dialog.component';
import { WidgetSettingsDialogComponent } from '../widget-settings-dialog/widget-settings-dialog.component';

@Component({
  selector: 'hyt-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {
  @ViewChild(WidgetsLayoutComponent, { static: true })
  dashboardLayout: WidgetsLayoutComponent;
  
  @Input() dashboardId: string;

  constructor(
  ) { }

  ngOnInit() {
    // this.dashboardId = this.activatedRoute.snapshot.paramMap.get('dashboardId');
  }

  onActivate(childComponent) {
    if (childComponent instanceof AddWidgetDialogComponent) {
      childComponent.addWidgets.subscribe((widgets) => this.onWidgetsAdd(widgets));
    } else if (childComponent instanceof WidgetSettingsDialogComponent) {
      const widgetId = childComponent.getWidgetId();
      const widget = this.dashboardLayout.getItemById(widgetId);
      childComponent.setWidget(widget);
    }
  }

  saveDashboard() {
    this.dashboardLayout.saveDashboard();
  }

  onWidgetsAdd(widgetList: any[]) {
    widgetList.map((widget) => {
      this.dashboardLayout.addItem(widget);
    });
  }
}
