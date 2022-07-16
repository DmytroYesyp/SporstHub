import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {mainPage} from "../services/main-page.service";
import {concatMap, from, Observable} from "rxjs";
import {PopupDeleteLangComponent} from "../pop-ups/popup-delete-lang/popup-delete-lang.component";
import {MatDialog} from "@angular/material/dialog";
import {PopupDeleteFollowComponent} from "../pop-ups/popup-delete-follow/popup-delete-follow.component";

@Component({
  selector: 'app-teamhub',
  templateUrl: './teamhub.component.html',
  styleUrls: ['./teamhub.component.css']
})

export class TeamhubComponent implements OnInit {
  id: any;
  user: Object;
  userList: any;
  role: any;
  news: any =[];
  teams: any =[];

  constructor(private http : HttpClient, private mainpage: mainPage, private dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.getUserFromToken()
    this.http.get('http://localhost:8080/follows?userId=0')
      .subscribe(() => {
        console.log(this.id)

        this.http.get('http://localhost:8080/follows?userId='+this.id)
          .subscribe((Response) => {
            this.userList = Response
            console.log(this.userList)

            from(this.userList).pipe(
              concatMap(x=> {
                return this.getTeams(x);
              })).subscribe(Response => {
              this.teams.push(<Array<any>>Response);
            });
            console.log(this.teams)


            from(this.userList).pipe(
              concatMap(x=> {
                return this.getNews(x);
              })).subscribe(Response => {
              this.news.push(<Array<any>>Response);
            });
            console.log(this.news)

          });
      })

  }

  getUserFromToken() {
    const token = localStorage.getItem('auth-token')
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
        if (key == "id")
          this.id = value;
      }
    });
    return this.id
  }

  private getNews(x): Observable<any>{
    return this.http.get('http://localhost:8080/news?limit=3&teamIds=' + x['teamId'])
  }
  private getTeams(x): Observable<any>{
    return this.http.get('http://localhost:8080/teams/' + x['teamId'])
  }

  openDialog(teamId, userId, name){
    this.dialogRef.open(PopupDeleteFollowComponent, {
      data: {
        teamId: teamId,
        userId: userId,
        name: name
      }
    })
  }

}
