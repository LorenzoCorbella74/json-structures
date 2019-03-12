import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "./locastorage.service";

import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase";

@Injectable({
  providedIn: "root"
})
export class AuthenticateService {
  user: User;

  constructor(
    private router: Router,
    private mem: LocalStorageService,
    private firebaseAuth: AngularFireAuth
  ) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem("user", JSON.stringify(this.user));
      } else {
        localStorage.setItem("user", null);
      }
    });
  }

  signup(email: string, password: string) {
    this.firebaseAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log("Utente: ", value);
        return value;
      })
      .catch(err => {
        console.log("Something went wrong:", err.message);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log("Nice, it worked!");
        localStorage.setItem("user", JSON.stringify(value));
        this.router.navigate(["/projects"]);
        return value;
      })
      .catch(err => {
        console.log("Something went wrong:", err.message);
      });
  }

  logout() {
    localStorage.removeItem("user");
    this.firebaseAuth.auth.signOut();
    this.router.navigate(["/login"]);
  }

  isLoggedIn() {
    const user = localStorage.getItem("user");
    return user ? true : false;
  }
}
