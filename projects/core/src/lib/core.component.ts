import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hyt-core",
  template: ` <p>core works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoreComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
