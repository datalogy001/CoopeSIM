import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Router, NavigationExtras } from '@angular/router';
import OneSignalPlugin from 'onesignal-cordova-plugin'
import { Platform, ModalController } from '@ionic/angular';
import { ServicesService } from './../api/services.service';
import { PermissionModalPage } from '../permission-modal/permission-modal.page';

@Component({
  selector: 'app-onboard-two',
  templateUrl: './onboard-two.page.html',
  styleUrls: ['./onboard-two.page.scss'],
})
export class OnboardTwoPage implements OnInit {

  playerIds: any;

  constructor(private apiService: ServicesService, private platform: Platform, private Router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {
    //Notification Permission Popup 
    this.platform.ready().then(() => {
      if (this.platform.is('android') || this.platform.is('ios')) {
        OneSignalPlugin.setAppId('6bacd441-2725-432b-9c48-0cf95e377be8');
      }
    });

  }

  async gotoSettings() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      OneSignalPlugin.promptForPushNotificationsWithUserResponse(function (accepted) {
        if (accepted == true)
          window.localStorage.setItem('eSIM_IsNotiSettingAllow', "yes");
      });

      setTimeout(() => {
        OneSignalPlugin.getDeviceState((response) => {
          try {
            this.playerIds = window.localStorage.getItem('coop_PLAYER_ID');
            if (this.playerIds == null) {
              if (response.userId) {
                window.localStorage.setItem('coop_PLAYER_ID', response.userId);
                this.updatePlayerId(response.userId);
              }
            } else {
              window.localStorage.setItem('coop_PLAYER_ID', this.playerIds);
            }
          } catch (error) {
            // Handle the error here
            // alert("Error getting device state:" +  JSON.stringify(error));
            // You can display an alert or log the error for debugging purposes
            // alert("Error getting device state: " + error.message);
          }
        })
      }, 500);
    }
    else{
      window.localStorage.setItem('eSIM_IsNotiSettingAllow', "yes");
    }
    this.Router.navigate(['home-search']);
   /* const modal = await this.modalCtrl.create({
      component: PermissionModalPage
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data == 1) {
        if (this.platform.is('android') || this.platform.is('ios')) {
          OneSignalPlugin.promptForPushNotificationsWithUserResponse(function (accepted) {
            if (accepted == true)
              window.localStorage.setItem('eSIM_IsNotiSettingAllow', "yes");
          });

          setTimeout(() => {
            OneSignalPlugin.getDeviceState((response) => {
              try {
                this.playerIds = window.localStorage.getItem('coop_PLAYER_ID');
                if (this.playerIds == null) {
                  if (response.userId) {
                    window.localStorage.setItem('coop_PLAYER_ID', response.userId);
                    this.updatePlayerId(response.userId);
                  }
                } else {
                  window.localStorage.setItem('coop_PLAYER_ID', this.playerIds);
                }
              } catch (error) {
                // Handle the error here
                // alert("Error getting device state:" +  JSON.stringify(error));
                // You can display an alert or log the error for debugging purposes
                // alert("Error getting device state: " + error.message);
              }
            })
          }, 500);
        }
        this.Router.navigate(['home-search']);
      } else {
        this.Router.navigate(['home-search']);
      }
    });

    return await modal.present(); */



  }

  userDetails: any = [];
  authToken: any;
  pushDBToken: any = { 'deviceToken': '', 'userid': '' };

  updatePlayerId(pushToken: any) {

    //Update token in db 
    if (window.localStorage.getItem("coop_auth_token") != null) {

      this.userDetails = window.localStorage.getItem('coop_userDetails');
      this.userDetails = JSON.parse(this.userDetails);
      this.pushDBToken.deviceToken = pushToken;
      this.pushDBToken.userid = this.userDetails.id;
      this.authToken = window.localStorage.getItem("coop_auth_token");

      this.apiService.addPlayerId(this.pushDBToken, this.authToken).then((res: any) => {
        if (res.code == 200) {
          console.log("Added player id");
        }
        else {
          console.log("unable to add player id");
        }
      }).catch(err => {
        console.log("Something went wrong");
      })
      //End 
    }
  }

  gotoHomeSearch() {
    this.Router.navigate(['home-search']);
  }

}
