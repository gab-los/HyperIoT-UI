import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hyt-tag-list",
  templateUrl: "./hyt-tag-list.component.html",
  styleUrls: ["./hyt-tag-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HytTagListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
