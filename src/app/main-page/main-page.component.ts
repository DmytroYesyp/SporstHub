import {Component, OnInit} from '@angular/core';
import {mainPage} from "../services/main-page.service";
import {AuthService} from "../services/auth.service";
import {AppComponent} from "../app.component";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {


  email: string;
  dateLimits: any;
  firstName: any;
  lastName: any;
  isAdmin: boolean = false;

  role: string;

  user: Object;

  authenticated: boolean = false;

  constructor(private mainpage: mainPage,
              private auth: AuthService,
              private app: AppComponent,
              public translate: TranslateService,
              private router: Router,
              private http: HttpClient) {
  }

  getUserFromToken(){

    const token = localStorage.getItem('auth-token');
    if (!token)
      return console.log("error");
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const tmp = JSON.parse(jsonPayload);


    this.mainpage.getUserByEmail(tmp.sub).subscribe(data => {
      this.user = data

      for (let [key, value] of Object.entries(this.user)) {
        if (key == "firstName")
          this.firstName = value;
        if (key == "lastName")
          this.lastName = value
      }

    });
    //console.log(this.firstName , this.lastName);
    return tmp;
  }


  search: String = "";
  foods: any;


  ngOnInit(): void {
    if(this.auth.isAuthenticated()){
      this.authenticated = true
    }else{
      this.auth.logout()
    }
    if(this.app.isExpired()){
      localStorage.removeItem('auth-token')
      this.router.navigate(['/login'])
    }

    this.role = this.app.getUserFromToken()
    console.log(this.role)
    if(this.role=="admin"){
      this.isAdmin = true;
    }
    this.http.get('http://localhost:8080/datelimits')
      .subscribe(Response => {
        this.dateLimits = <Array<any>>Response
      });
  }

  logOut(){
    this.auth.logout()
  }
}
