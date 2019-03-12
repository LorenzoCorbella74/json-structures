import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

// SERVICES

import { LocalStorageService } from "../../services/locastorage.service";
import { AuthenticateService } from "../../services/authenticate.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;

  form: FormGroup;
  private formSubmitAttempt: boolean;

  loading: boolean = false;

  loginSub$: Subscription;
  subscription: Subscription[] = [this.loginSub$];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private auth: AuthenticateService,
    private router: Router,
    private mem: LocalStorageService
  ) {
    console.warn(this.constructor.name);
  }

  ngOnInit() {
    this.form = this.fb.group({
      userName: ["", Validators.required],
      password: ["", Validators.required]
    });
    /* if (this.auth.isLoggedIn()) {
      this.router.navigate(['/projects']);
    } */
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  login() {
    if (this.form.valid) {
      this.loading = true;
      this.auth.login(this.form.value.userName, this.form.value.password);
    }
  }
}
