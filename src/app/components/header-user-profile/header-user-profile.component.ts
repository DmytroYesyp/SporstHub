import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {mainPage} from "../../services/main-page.service";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {reload} from "@angular/fire/auth";

@Component({
  selector: 'app-header-user-profile',
  templateUrl: './header-user-profile.component.html',
  styleUrls: ['./header-user-profile.component.css']
})

export class HeaderUserProfileComponent implements OnInit {
  email: string;
  profileUrl : string

  @Input() arr :string[] = ["Viev Profile","Change password","My surveys","My teamhub","Log out"]
  @Input() arr2 :string[]  = ["/profile","","","","/login"]

  firstName: any;
  lastName: any;
  role: any;
  user: Object;
  view:boolean = false;


  createRange(number) {
    var items: number[] = [];
    for (var i = 0; i <= number; i++) {
      items.push(i);
    }
    return items;
    return new Array(number);
  }

  constructor(private mainpage: mainPage,private http:HttpClient) {
  }


  getUserFromToken() {

    const token = localStorage.getItem('auth-token');
    console.log("token", token)
    if (!token)
      return console.log("error");
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const tmp = JSON.parse(jsonPayload);


    console.log(tmp.sub)

    this.mainpage.getUserByEmail(tmp.sub).subscribe(data => {
      console.log(data)
      this.user = data

      for (let [key, value] of Object.entries(this.user)) {
        if (key == "firstName")
          this.firstName = value;
        if (key == "lastName")
          this.lastName = value
      }

    });
    return tmp;
  }

  // viewFunc(): Promise<boolean>{
  //   this.http.get('http://localhost:8080/api/pictures/getUserProfileImage',{responseType : 'text'})
  //     .subscribe(responseData =>{this.profileUrl = responseData; this.view=true})
  //   return new Promise(this.view)
  // }





  ngOnInit(): void {
    // @ts-ignore

    // console.log(this.http.get<string>('http://localhost:8080/api/pictures/getUserProfileImage'))
    this.mainpage.getUserByEmail(this.getUserFromToken())
    this.http.get('http://localhost:8080/api/pictures/getUserProfileImage',{responseType : 'text'}).subscribe(responseData =>{this.profileUrl = responseData})
    this.view = true;
    // console.log(this.profileUrl)
    // setTimeout(()=>{
    //
    // }, 2000)
  }

}