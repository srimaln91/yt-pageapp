import { Component, OnInit } from '@angular/core';
import { Modal, NavController, Alert } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SocialSharing } from '@ionic-native/social-sharing';
import { YoutubeService } from '../../providers/youtube-service/youtube-service';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
@Component({
  templateUrl: './home.html', 
  providers:[YoutubeService, SocialSharing]
})
export class HomePage implements OnInit {

  channelID: string = 'UC58CRxjbktfc0hg-n5WbJwg';
  maxResults: string = '10';
  pageToken: string; 
  googleToken: string = 'AIzaSyACxXdM3QuXUBgwEUFDTzDYzukY4eMZSpU';
  searchQuery: string = '';
  posts: any = [];
  onPlaying: boolean = false; 

  initialVideo: any;
  pagedata: any = false;
  loader: any;

  constructor(
    public http: Http,
    public nav:NavController,
    public ytPlayer: YoutubeService,
    private socialSharing: SocialSharing,
    private splashScreen: SplashScreen,
    private network: Network,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
    ) {
    // this.loadSettings();

    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
  }

  ngOnInit() {
    this.fetchData();

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
        if( !this.pagedata ) {
          const toast = this.toastCtrl.create({
            message: 'Network Connected!',
            duration: 3000
          });
          toast.present();
          this.fetchData();

        }
      }, 3000);
    });

  }

  launchYTPlayer(id, title): void {
    this.ytPlayer.launchPlayer(id, title);
  }

  fetchData(): void {

    let url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=' + this.channelID + '&q=' + this.searchQuery + '&type=video&order=date&maxResults=' + this.maxResults + '&key=' + this.googleToken;

    if(this.pagedata) {
      url += '&pageToken=' + this.pagedata.next;
    }

    this.loader.present();

    this.http.get(url).map(res => res.json()).subscribe(data => {
      
      console.log (data.items);
      // *** Get individual video data like comments, likes and viewCount. Enable this if you want it.
      // let newArray = data.items.map((entry) => {
      //   let videoUrl = 'https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&id=' + entry.id.videoId + '&key=' + this.googleToken;
      //   this.http.get(videoUrl).map(videoRes => videoRes.json()).subscribe(videoData => {
      //     console.log (videoData);
      //     this.posts = this.posts.concat(videoData.items);
      //     return entry.extra = videoData.items;
      //   });
      // });
      // this.pagedata.prev = data.prevPageToken;
      // this.pagedata.next = data.nextPageToken;
      this.pagedata = {
        prev: data.prevPageToken,
        next: data.nextPageToken
      }

      this.splashScreen.hide();
      this.loader.dismiss();
      this.initialVideo = data.items.shift();
      this.posts = this.posts.concat(data.items);

    });
  }
  // loadSettings(): void {
  //     this.fetchData();
  // }
  openSettings(): void {
      console.log("TODO: Implement openSettings()");
  }
  playVideo(e, post): void {
      console.log(post);
      this.onPlaying = true;
      this.ytPlayer.launchPlayer(post.id, post.snippet.title);
  }
  loadMore(): void {
    this.fetchData();
  }

  share(title, videoId) {
    this.socialSharing.share(title, title, null, 'https://www.youtube.com/watch?v=' + videoId);
  }
}
