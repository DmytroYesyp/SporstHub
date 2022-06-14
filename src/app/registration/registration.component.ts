import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {HttpParams} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {AppComponent} from "../app.component";
import {User} from "../services/user";
import {OAuthService} from "angular-oauth2-oidc";
import {googleRegisterConfig} from "../auth-config";
import {JwksValidationHandler} from "angular-oauth2-oidc-jwks";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit, OnDestroy{
  name: string;
  email: string;
  picture: string;

  // form: FormGroup
  aSub: Subscription
  user: User;

  // @Input() formError = 'Error';

  hide=true;

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  constructor(private auth: AuthService,
              private router: Router,
              private app: AppComponent,
              private oauthService: OAuthService,
              private http: HttpClient) {
    this.configure();
  }

  private configure() {
    this.oauthService.configure(googleRegisterConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  get isLoggedIn() {
    return !!this.oauthService.getIdToken();
  }

  get claims() {
    console.log(this.oauthService.getIdentityClaims())
    return this.oauthService.getIdentityClaims() as any;
  }

  sendUser(){

    this.user = {
      'firstName' : this.claims.given_name,
      'lastName': this.claims.family_name,
      'email' : this.claims.email,
      'logo_url' : this.claims.picture,
      'password' : 'supersecret'
    }
    localStorage.setItem('user', this.user.email)
    this.http.post('http://localhost:8080/api/users/registerUser', this.user).subscribe(
      ()=> {
        console.log('Register success')
        this.router.navigate(['/main'])
      },
      error =>{
        console.log("Error happened")
        this.router.navigate(['/register'])
      }
    )
  }

  ngOnInit() {
    this.auth.logout()

  }

  ngOnDestroy() {
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }

  onSubmit(){
    // this.form.disable()

    this.user = {
      'firstName' : this.form.value.firstName,
      'lastName': this.form.value.lastName,
      'email' : this.form.value.email,
      'password' : this.form.value.password,
      'logo_url' : 'User.png'
    }

    this.aSub = this.auth.register(this.user).subscribe(
      ()=> {
        console.log('Register success')
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        })
      },
      error =>{
        this.app.openSnackBar("Such email is already in use","Ok")
        this.form.enable()
      }
    )
  }

  submit():void{
    this.oauthService.initLoginFlow();
    console.log("syka")
    // this.sendUser();
    // console.log("pizda")
  }

  onFormChange(){
    // this.formError = '';
  }

}

