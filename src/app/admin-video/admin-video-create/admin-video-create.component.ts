import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {mainPage} from "../../services/main-page.service";
import {AuthService} from "../../services/auth.service";
import {AppComponent} from "../../app.component";
import {TranslateService} from "@ngx-translate/core";
import {Video} from "../../services/video";

@Component({
  selector: 'app-admin-video-create',
  templateUrl: './admin-video-create.component.html',
  styleUrls: ['./admin-video-create.component.css']
})
export class AdminVideoCreateComponent implements OnInit {

  isHovering: boolean;
  files: File[] = [];
  file: File;
  video: Video;
  description: string;

  email: string;
  show: boolean = true;

  firstName: any;
  lastName: any;
  isAdmin: boolean = false;
  upload: boolean = false;

  role: string;

  user: Object;

  authenticated: boolean = false;

  form = new FormGroup({
      description: new FormControl('', [Validators.required])
    }
  );

  constructor(private mainpage: mainPage,
              private auth: AuthService,
              private app: AppComponent,
              public translate: TranslateService) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
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
  hide: boolean = false;

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


    // this.mainpage.getUserByEmail(this.getUserFromToken())


    // this.firstName = user.firstName;
    // this.lastName = user.lastName;
  }

  logOut(){
    this.auth.logout()
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(<File>files.item(i))
      console.log(files)
    }
  }

  url;
  format;
  name;
  time;
  onSelectFile(event) {
    this.show = false;
    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      this.time = new Date(this.file.lastModified);
      this.name = this.file.name;
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if(this.file.type.indexOf('image')> -1){
        this.format = 'image';
      } else if(this.file.type.indexOf('video')> -1){
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }

  onSubmit(){
    this.upload = true;
    this.description = this.form.value.description;
    this.hide = true;
  }

}
