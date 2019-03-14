import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './locastorage.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
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
        this.mem.set('user', this.user);
      } else {
        this.mem.set('user', null);
      }
    });
  }

  signup(email: string, password: string) {
    this.firebaseAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Utente: ', value);
        return value;
      })
      .catch(err => {
        console.log('Something went wrong in signup:', err.message);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('User logged in...', value);
        this.mem.set('user', value);
        this.router.navigate(['/projects']);
        return value;
      })
      .catch(err => {
        console.log('Something went wrong in login:', err.message);
      });
  }

  logout() {
    this.mem.clear('user');
    this.firebaseAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    const user = this.mem.get('user');
    return user && user.uid ? true : false;
  }
}
