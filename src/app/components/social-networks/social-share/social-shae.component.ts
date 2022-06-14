import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppComponent} from "../../../app.component";
import {Clipboard} from '@angular/cdk/clipboard';


@Component({
  selector: 'app-social-share',
  templateUrl: './social-shae.component.html',
  styleUrls: ['./social-shae.component.css']
})
export class SocialShaeComponent implements OnInit {
  form: FormGroup
  show: Boolean = false
  isAdmin: boolean = false;
  role: string;

  constructor(private clipboard: Clipboard,private http: HttpClient,private app: AppComponent) {
  }

  prefix : string = "http://localhost:4200"
  @Input() path :string = "/main"

  delete(id: number) {
    this.http.delete(`http://localhost:8080/api/socialShare/deleteShares?Id=` + id).subscribe()
    setTimeout(function () {
      window.location.reload()
    }, 250)
  }

  copySite() {
    this.clipboard.copy(this.prefix+this.path)
  }

  OnSubmit() {

    this.http.post(`http://localhost:8080/api/socialShare/addShares`, this.form.value).subscribe()
    setTimeout(function () {
      window.location.reload()
    }, 250)
  }

  reverse(): void {
    this.show = !this.show
  }

  list: socialFollow[];

  ngOnInit(): void {
    this.http.get<socialFollow[]>(`http://localhost:8080/api/socialShare/getAllShares`).subscribe(data => {
      this.list = data
    })
    this.form = new FormGroup({
      url: new FormControl('', [Validators.required]),
      pictogram: new FormControl('', [Validators.required]),
    })

    this.role = this.app.getUserFromToken()
    console.log(this.role)
    if (this.role == "admin") {
      this.isAdmin = true;
    }
  }
}

export class socialFollow {
  id: number
  url: string
  pictogram: string
}
