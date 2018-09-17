import { Component, OnInit } from '@angular/core';
import { Modal, NavController, Alert } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SocialSharing } from '@ionic-native/social-sharing';
import { YoutubeService } from '../../providers/youtube-service/youtube-service';
import { SplashScreen } from '@ionic-native/splash-screen';

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

  constructor(
    public http: Http,
    public nav:NavController,
    public ytPlayer: YoutubeService,
    private socialSharing: SocialSharing,
    private splashScreen: SplashScreen
    ) {
    // this.loadSettings();
  }

  ngOnInit() {
    this.fetchData();
  }

  launchYTPlayer(id, title): void {
    this.ytPlayer.launchPlayer(id, title);
  }

  fetchData(): void {

    let url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=' + this.channelID + '&q=' + this.searchQuery + '&type=video&order=date&maxResults=' + this.maxResults + '&key=' + this.googleToken;

    if(this.pagedata) {
      url += '&pageToken=' + this.pagedata.next;
    }

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
