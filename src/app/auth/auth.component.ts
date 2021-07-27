import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable} from 'rxjs';
import { AlertComponent } from '../alert/alert.component';
import { PlaceholdDirective } from '../_directives/placehold.directive';
import { AuthResponseData } from '../_modals/authResponseData.model';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLogin = true;
  isLoading = false;
  error:string = null;
  private closeSub: Subscription;

  @ViewChild(PlaceholdDirective, {static: true}) alertHost: PlaceholdDirective;

  constructor(
    private authService: AuthService,
    private router:Router,
    private componentFactoryResolver: ComponentFactoryResolver) { }

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
      this.showErrorAlert(errorMessage);
      this.error = errorMessage;
    });

    form.reset();
  }

  onCloseAlert(){
    this.error = null;
  }

  // dynamically load components
  private showErrorAlert(message: string){
    const alertComponentFactory = this.componentFactoryResolver
      .resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }
}
