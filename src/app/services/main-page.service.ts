import {Component, Injectable, OnInit} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observer} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class mainPage implements OnInit {

  user : Object;


  constructor(private http: HttpClient, private auth:AuthService) {

  }


  getUserByEmail(email: string){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("email",email);

      let token = this.auth.getToken();
      console.log(token);
    return this.http.get('http://localhost:8080/api/users/getUserByEmail', {params: queryParams})
  }

  ngOnInit(): void {
  }
}

