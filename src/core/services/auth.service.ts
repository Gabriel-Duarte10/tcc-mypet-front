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
import { User, UserRegistration } from '../interfaces/user';
import { LoginRequest } from '../interfaces/auth';
import { environment } from '../environments/environment';

const STORAGE_KEY = 'loggedUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  get expiration() {
    let token = AuthService.getToken();
    if(token)
    {
      const decoded = jwt_decode(token) as any;
      if (decoded['exp'] === undefined) {
        return null;
      }
      const date = new Date(0);
      date.setUTCSeconds(decoded['exp']);
      return date;
    }
    return null;
  }

  get expirated() {
    return this.expiration !== null && this.expiration.getTime() < Date.now();
  }

  get isLoggedIn() {
    return AuthService.getToken() && !this.expirated;
  }

  static getToken() {
    let token = localStorage.getItem(STORAGE_KEY) || null;
    if(token != null)
    {
      return token as string;
    }
    return false
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
        environment.api + 'Auth/LoginAdmin',
        loginRequest
      )
      .toPromise()
      .then((loginString?: any) => {
        if (loginString) {
          this.saveToken(loginString.token);
          success = true;
          this.checkAuth();
        }
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });

    return success;
}

  async logout(redirect?: string) {
    this.clearToken();
    document.location.reload();
  }
  saveToken(token: string) {
    if(token != null)
    {
      localStorage.setItem(STORAGE_KEY, token);
    }
  }
  clearToken() {
    localStorage.removeItem(STORAGE_KEY);
  }
  register(userData: UserRegistration): Promise<boolean> {
    return this.http.post<boolean>(`${environment.api}Administrators`, userData)
      .toPromise()
      .then(response => {
        return true;  // Se o registro for bem-sucedido, retorne true.
      })
      .catch(error => {
        console.error(error);
        throw error;  // Rejeite a promessa com o erro.
      });
  }
  initiateResetPassword(email: string): Promise<any> {
    const url = `${environment.api}Auth/InitiateResetAdmin`;
    return this.http.post(url, { email })
      .toPromise()
      .then(response => {
        return response;  // Se a requisição for bem-sucedida, retorne a resposta.
      })
      .catch(error => {
        console.error(error);
        throw error;  // Rejeite a promessa com o erro.
      });
  }

  validateResetCode(email: string, cellphoneCode: number): Promise<any> {
    const url = `${environment.api}Auth/ValidateCodeAdmin`;
    return this.http.post(url, { email, cellphoneCode })
      .toPromise()
      .then(response => {
        return response;  // Se a validação for bem-sucedida, retorne a resposta.
      })
      .catch(error => {
        console.error(error);
        throw error;  // Rejeite a promessa com o erro.
      });
  }
  completeResetPassword(email: string, newPassword: string, confirmNewPassword: string): Promise<any> {
    const url = `${environment.api}Auth/CompleteResetAdmin`;
    const data = {
      email: email,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword
    };
    return this.http.post(url, data)
      .toPromise()
      .then(response => {
        return true;  // Se a redefinição for bem-sucedida, retorne true.
      })
      .catch(error => {
        console.error("Erro ao redefinir a senha:", error);
        throw error;  // Rejeite a promessa com o erro.
      });
  }

}
