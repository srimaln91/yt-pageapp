import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';

import { YtApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SocialShare } from '../modules/social-share/social-share';

@NgModule({
  declarations: [
    YtApp,
    HomePage,
    SocialShare
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(YtApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    YtApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
