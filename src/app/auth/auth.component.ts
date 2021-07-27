import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData } from '../_modals/authResponseData.model';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLogin = true;
  isLoading = false;
  error:string = null;
  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLogin = !this.isLogin;
  }

  onSubmit(form:NgForm){
    if( !form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs$: Observable<AuthResponseData>;
    this.isLoading = true;
    if(this.isLogin){
      //login
      authObs$ = this.authService.login(email, password);
    }else {
      //signup
      authObs$ = this.authService.signup(email, password);
    }
    authObs$.subscribe( response => {
      console.log(response);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.isLoading = false;
      this.error = errorMessage;
    });

    form.reset();
  }

}
