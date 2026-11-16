import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { HytAlarm } from "core";

@Component({
  selector: "hyt-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
