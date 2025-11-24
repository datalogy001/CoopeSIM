import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Market } from '@ionic-native/market/ngx';
@Component({
  selector: 'app-update-app',
  templateUrl: './update-app.page.html',
  styleUrls: ['./update-app.page.scss'],
})
export class UpdateAppPage implements OnInit {
  constructor(private market: Market,private platform: Platform) {}

  ngOnInit() {
  }

  updateNow() {
    if (this.platform.is('ios')) {
      // Redirect to the iOS App Store
     //  window.open('https://apps.apple.com/us/app/coop-travel-esim-global-data/id6748068641', '_system');
    } else if (this.platform.is('android')) {
      // Redirect to the Google Play Store
      this.market.open('com.cooptraveleSIM');
    }

    // Note: Do not dismiss the modal here
  }
}
