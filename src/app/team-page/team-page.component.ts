import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css']
})
export class TeamPageComponent implements OnInit {
  list: any;
  authenticated: boolean = false;
  article: any;
  date: string;
  league: any;
  leagueId: any;
  team:any;

  constructor(private http : HttpClient, private auth: AuthService) { }

  ngOnInit(): void {
    if(this.auth.isAuthenticated()){
      this.authenticated = true
    }

    let Id = this.getId()
    this.http.get('http://localhost:8080/news?teamIds=' + Id)
      .subscribe(Response => {
        this.list=(<Array<any>>Response).slice(Math.max(0, (<Array<any>>Response).length - 10), (<Array<any>>Response).length);
        this.article = this.list.pop();
        console.log(this.article);
        console.log(this.list);
        this.date = this.getDate();
        console.log(this.date)
        this.leagueId = this.getLeagueId();
        this.http.get('http://localhost:8080/leagues/' + this.leagueId)
          .subscribe(Response => {
            this.league=(<Array<any>>Response);
            console.log(this.league);
          });
        this.http.get('http://localhost:8080/teams/' + Id)
          .subscribe(Response => {
            this.team = (<Array<any>>Response);
            console.log(this.team);
          });
      });

  }

  getId(){
    let baseUrl = (window.location).href;
    return baseUrl.substring(baseUrl.lastIndexOf('/') + 1)
  }

  getDate(){
    return this.article['publicationDate'].substring(0,10) + ' ' + this.article['publicationDate'].substring(11,19)
  }

  getLeagueId(){
    return this.article['leagueId']
  }
}
