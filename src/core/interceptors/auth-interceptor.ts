import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(protected authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let apiReq = req.clone();

    if (AuthService.getToken()) {
      apiReq = apiReq.clone({
        setHeaders: { Authorization: `Bearer ${AuthService.getToken()}` },
      });
    }

    return next.handle(apiReq);
  }
}
