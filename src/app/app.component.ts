import { Component } from "@angular/core";
import { AuthenticateService } from "./app/services/authenticate.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(public a: AuthenticateService) {}

  logout() {
    this.a.logout();
  }
}
