import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hyt-card",
  templateUrl: "./hyt-card.component.html",
  styleUrls: ["./hyt-card.component.css"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HytCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
