import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';

/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: './social-share.html',
  selector: 'social-share'
})
export class SocialShare {

  constructor(private socialShare: SocialSharing) {
    
  }

  share() {
    this.socialShare.share("Hello", "Hi", null, 'http://www.example.com');
  }

}
