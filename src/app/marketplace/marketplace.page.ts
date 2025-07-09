import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
})
export class MarketplacePage implements OnInit {

  constructor(private iab: InAppBrowser, private translate: TranslateService,private navController: NavController) { }


  ngOnInit() {
  }

  gotoBack()
  {
    this.navController.pop();
  }
  gototab5() {
    if(window.localStorage.getItem('coop_auth_token')== null || window.localStorage.getItem('coop_auth_token')== '') 
this.navController.navigateRoot('tab5');
else
this.navController.navigateRoot('profile');
  }
  gototab1() {
    this.navController.navigateRoot('tab1');
  }
  
  gototab2() {
    this.navController.navigateRoot('tab2');
  }

openInAppBrowser(url: string, title: string) {
  const options: InAppBrowserOptions = {
    location: 'yes',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    hardwareback: 'yes',
    zoom: 'yes',
    toolbar: 'yes',
    useWideViewPort: 'yes',
    mediaPlaybackRequiresUserAction: 'no'
  };

  const browser: InAppBrowserObject = this.iab.create(url, '_blank', options);

  // Listen for load error
  const loadErrorSub = browser.on('loaderror').subscribe(event => {
    console.warn(`InAppBrowser failed to load: ${url}, falling back to _system`);
    browser.close(); // Close failed in-app browser
    this.iab.create(url, '_system'); // Open in system browser
  });

  // Optional: Clean up on browser exit
  const exitSub = browser.on('exit').subscribe(() => {
    loadErrorSub.unsubscribe();
    exitSub.unsubscribe();
  });
}
}
