import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class YtApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private network: Network,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      //Check network status on app startup
      if (network.type == 'none') {
        let alert = this.alertCtrl.create({
          title: 'No internet connection',
          subTitle: 'Please turn on your internet connection to proceed',
          buttons: ['Settings']
        });
        alert.present();
      } else {
        this.initializeIframeApi();
      }

      // watch network for a disconnect
      this.network.onDisconnect().subscribe(() => {
        const toast = this.toastCtrl.create({
          message: 'Network Disconnected!',
          duration: 3000,
          cssClass: 'toast-error'
        });
        toast.present();
      });


      // watch network for a connection
      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          const toast = this.toastCtrl.create({
            message: 'Network Connected!',
            duration: 3000
          });
          toast.present();
          this.initializeIframeApi();
        }, 3000);

      });

      statusBar.styleDefault();
      statusBar.overlaysWebView(true);
      splashScreen.hide();
    });
  }

  initializeIframeApi() {
    //Initialize youtube Iframe API
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

}

// ionicBootstrap(MyApp);
