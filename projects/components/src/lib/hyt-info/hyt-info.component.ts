import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";

@Component({
  selector: "hyt-info",
  templateUrl: "./hyt-info.component.html",
  styleUrls: ["./hyt-info.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HytInfoComponent {
  @Input() text = "";

  @Input() position: "above" | "below" | "left" | "right" | "before" | "after" =
    "above";
}
