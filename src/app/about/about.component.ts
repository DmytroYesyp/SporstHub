import { Component, OnInit } from '@angular/core';
import {mainPage} from "../services/main-page.service";
import {AuthService} from "../services/auth.service";
import {AppComponent} from "../app.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  user: Object;
  firstName: any;
  lastName: any;

  role: string;
  isAdmin: boolean = false;
  authenticated: boolean = false;

  constructor(private mainpage: mainPage, private auth: AuthService, private app: AppComponent, public translate: TranslateService) { }

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

  ngOnInit(): void {
    if(this.auth.isAuthenticated()){
      this.authenticated = true
    }else{
      this.auth.logout()
    }

    this.role = this.app.getUserFromToken()
    console.log(this.role)
    if(this.role=="admin"){
      this.isAdmin = true;
    }


  }

  logOut(){
    this.auth.logout()
  }

}