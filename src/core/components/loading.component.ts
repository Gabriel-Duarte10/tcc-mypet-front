import { Component } from "@angular/core";

@Component({
  template: `
  <div class="d-flex justify-content-center align-items-center h-100">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>`,
})
export class LoadingComponent {
  constructor() {}
}
