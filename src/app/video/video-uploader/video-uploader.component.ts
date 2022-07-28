import {Component, Input, OnInit} from '@angular/core';
import {finalize, tap} from "rxjs/operators";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {Observable} from "rxjs";
import {getStorage, ref, getDownloadURL, uploadBytesResumable} from "firebase/storage"
import {AuthService} from "../../services/auth.service";
import {listAll} from "@angular/fire/storage";
import {AdminVideoCreateComponent} from "../../admin-video/admin-video-create/admin-video-create.component";
import {User} from "../../services/user";
import {HttpClient} from "@angular/common/http";
import {Video} from "../../services/video";
import {Router} from "@angular/router";
import {AppComponent} from "../../app.component";
import {ProgressSpinnerMode} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.css']
})
export class VideoUploaderComponent implements OnInit {

  initialImage: string = '';
  imageSrc: any = '';
  @Input() file: File;
  video: Video;



  downloadUrl;
  url: string;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  success: boolean = false;
  loading: boolean = false;

  mode: ProgressSpinnerMode = 'determinate';

  constructor(private storage: AngularFireStorage,
              private videoCreate: AdminVideoCreateComponent,
              private http: HttpClient,
              private auth: AuthService,
              private router: Router,
              private app: AppComponent) { }

  ngOnInit(): void {
    this.saveVideo()
  }


  async saveVideo() {
    this.loading=true;
    const storage = getStorage();
    const videoRef = ref(storage, `video/${Date.now()}_${this.file.name}`)

    const uploadTask = uploadBytesResumable(videoRef, this.file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.downloadUrl = downloadURL;
          this.url = this.downloadUrl;
          console.log('File available at', this.url);
          console.log(this.video)
          this.sendVideo()
          console.log("Done")
        });

      }
    );
  }

  sendVideo(){
    this.video = {
      'url' : this.url,
      'visible': false,
      'description' : this.videoCreate.description
    }
    this.auth.addVideo(this.video).subscribe(
      ()=> {
        this.loading=false;
        this.success = true;
        console.log('Add video success')
        this.app.openSnackBar("Video uploaded", "Ok")
      }, error => {
        this.loading=false;
        this.app.openSnackBar("Video upload failed", "Try again")
        console.warn(error)
      }
    )
  }

}
