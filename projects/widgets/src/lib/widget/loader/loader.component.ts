import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hyperiot-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoaderComponent {
  constructor() {}
}
