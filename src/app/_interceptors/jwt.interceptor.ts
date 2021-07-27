import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { User } from '../_modals/user.model';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;
    this.authService.user.pipe(take(1)).subscribe( user => currentUser = user);
    if(currentUser){
      request = request.clone({
        params:new HttpParams().set('auth', currentUser.token)
      })
    }
    return next.handle(request);
  }
}
