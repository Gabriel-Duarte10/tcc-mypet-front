import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '../interfaces/user';
import { LoginRequest } from '../interfaces/auth';
import { environment } from '../environments/environment';

const STORAGE_KEY = 'loggedUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loginString: string = "";

  get token() {
    if (this.loginString != "") {
      return this.loginString;
    }
    return false;
  }

  get expiration() {
    const decoded = jwt_decode(this.token.toString()) as any;
    if (decoded['exp'] === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded['exp']);
    return date;
  }

  get expirated() {
    return this.expiration !== null && this.expiration.getTime() < Date.now();
  }

  get isLoggedIn() {
    return this.token && !this.expirated;
  }

  static getToken() {
    return sessionStorage.getItem(STORAGE_KEY);
  }

  constructor(private http: HttpClient, protected router: Router) {}

  getUser() {
    let token = AuthService.getToken() || null;
    if(token != null)
    {
      let jsonToken = jwt_decode(token) as any;
      let usuario = {
        id: parseInt(jsonToken['nameid']),
        name: jsonToken['name'],
        email: jsonToken['email'],
        admin: jsonToken['role'] == "Administrator" ? true : false,
        cellphone: jsonToken['cellphone'],
      } as User;
      return usuario || null;
    }else{
      return null;
    }
  }

  isUserAdmin(): boolean {
    let user = this.getUser() as User | null;
    if(user == null)
    {
      return false;
    }else{
      const isAdmin = user.admin;

      return isAdmin;
    }
  }
  checkAuth(): Observable<boolean> {
    return of(!this.isLoggedIn);
  }

  async login(loginRequest: LoginRequest): Promise<boolean> {
    let success = false;

    await this.http
      .post<string | undefined>(
        environment.api + 'login',
        loginRequest
      )
      .toPromise()
      .then((loginString?: string) => {
        if (loginString) {
          this.loginString = loginString;
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loginString));
          success = true;
        } else {
          console.error('Login response is undefined');
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return success;
}

  async logout(redirect?: string) {
    this.clearToken();
  }

  clearToken() {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
