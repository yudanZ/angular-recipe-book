import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponseData } from '../_modals/authResponseData.model';
import { User } from '../_modals/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_Key: string = 'AIzaSyBZKqWbi-UzB33b7-4Ybq9SgEJjFKfpNbU';
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.API_Key,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.API_Key,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
      );
  }

  autoLogin(){
    const userData = JSON.parse(localStorage.getItem('user'));
    if(!userData){
      return;
    }
    const loadedUser = new User(userData.email,userData.id, userData._token , new Date(userData._tokenExpirationDate));
    // console.log(loadedUser);
    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }

  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('user');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }



  private handleAuthentication(email: string, localId: string,token: string, expiresIn: number){
    const expirationData = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, token, expirationData);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occured!';
    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email or Password is not correct';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Email or Password is not correct';
        break;
      }
    return throwError(errorMessage);
  }

}
