import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing/app-routing.module";
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { MainPageComponent } from './main-page/main-page.component';

import {MaterialModule} from "./material/material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import {TokenInterceptor} from "./classes/token.interceptor";
import { ProfileComponent } from './profile/profile.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';
import {MainKindsComponent} from "./services/main_kinds.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {AuthService} from "./services/auth.service";
import {HeaderUserProfileComponent} from "./components/header-user-profile/header-user-profile.component";
import {AdminPageComponent} from "./admin-page/admin-page.component";
import {NewsCardComponent} from "./services/news_card.component";
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { environment } from '../environments/environment';
import {NgpImagePickerModule} from "ngp-image-picker";
import {AdminTeamPageComponent} from "./admin-team-page/admin-team-page.component";
import { SearchFilterPipe } from './search-filter.pipe';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { ArticleComponent } from './article/article.component';
import { LangComponent } from './components/lang/lang.component';
import { SetLangComponent } from './set-lang/set-lang.component';
import {MatCheckboxModule} from "@angular/material/checkbox";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    MainKindsComponent,
    NewsCardComponent,
    AppComponent,
    RegistrationComponent,
    MainPageComponent,
    LoginComponent,
    ProfileComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    MainKindsComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    HeaderUserProfileComponent,
    AdminPageComponent,
    ArticleEditorComponent,
    UploaderComponent,
    AdminTeamPageComponent,
    SearchFilterPipe,
    AdminLayoutComponent,
    ArticleComponent,
    LangComponent,
    SetLangComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    MatCheckboxModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    NgpImagePickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    MatCheckboxModule
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    // provideStorage(() => getStorage())
  ],
  providers: [
    AuthService,
    AppComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
