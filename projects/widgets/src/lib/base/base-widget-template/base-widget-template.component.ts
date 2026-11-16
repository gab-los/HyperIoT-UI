import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hyperiot-base-widget-template",
  templateUrl: "./base-widget-template.component.html",
  styleUrls: ["./base-widget-template.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BaseWidgetTemplateComponent {}
