import { Component, OnInit, } from '@angular/core';
import { Platform, NavController, ToastController, LoadingController, ModalController } from "@ionic/angular";
import { Router, NavigationExtras } from '@angular/router';
import { ServicesService } from '../api/services.service';
import { AppleModelPage } from '../apple-model/apple-model.page'
import { HttpClient, HttpParams } from '@angular/common/http'
import { LoadingScreenAppPage } from '../loading-screen-app/loading-screen-app.page';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import OneSignalPlugin from 'onesignal-cordova-plugin';
import { PasswordErrorPage } from '../password-error/password-error.page';
import { SuccessModelPage } from '../success-model/success-model.page';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
 
  // Variables 
  appleresult: any;
  loginObj: any = { 'password': '', 'email': '', 'deviceToken': '' };
  rememberMe: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  tempDetails: any = [];
  checkoutObj: any = [];
  isLogin: any = '';
  googleLoginObj: any = { 'userId': '', 'first_name': '', 'email': '', 'deviceToken': '', 'requested_ip' : '' };
  facebookObj: any = { 'userId': '', 'first_name': '', 'email': '', 'deviceToken': '' };
  appleLoginObj: any = { 'apple_id': '', 'first_name': '', 'email': '', 'deviceToken': '' , 'requested_ip' : ''};
  rememberedCredentials: any;
  IsfacebookObj: any = { 'userId': '' };
  token: any;
  plat: any;
  playerIds: any;

  constructor(private keyboard: Keyboard, private translate: TranslateService,private googlePlus: GooglePlus, private loadingScreen: LoadingScreenAppPage, private http: HttpClient, private modalController: ModalController, private platform: Platform, private loadCtr: LoadingController, private service: ServicesService, private Router: Router, private navController: NavController, private toastController: ToastController) {
  }

   ionViewDidEnter() {
    this.googleLoginObj.requested_ip = window.localStorage.getItem('coop_IP') !=null? window.localStorage.getItem('coop_IP') : '';
    this.appleLoginObj.requested_ip = window.localStorage.getItem('coop_IP') !=null? window.localStorage.getItem('coop_IP') : '';

  this.playerIds = window.localStorage.getItem('coop_PLAYER_ID');
  if (this.playerIds != null) {
    this.googleLoginObj.deviceToken = this.playerIds;
    this.facebookObj.deviceToken = this.playerIds;
    this.loginObj.deviceToken = this.playerIds;
    this.appleLoginObj.deviceToken = this.playerIds;
  }
    // Load remembered credentials
    this.rememberedCredentials = window.localStorage.getItem('coop_credentials');
    if (this.rememberedCredentials) {
      this.rememberedCredentials = JSON.parse(this.rememberedCredentials);
      this.loginObj.email = this.rememberedCredentials.email;
      this.loginObj.password = this.rememberedCredentials.password,
      this.rememberMe = true;
    }
  }

  userLanguage: any={'language' : ''};
    //Update user language 
    async updateUserLanguage(token:any)
    {
    this.service.updateUserLanguage(token, this.userLanguage).then((res: any) => {
        if (res.code == 200) {
           // Add languages to support
        const languageToSet = res.data.language || 'en';
        this.translate.addLangs(['en']);
        // Set default language
        this.translate.setDefaultLang(languageToSet);
        this.translate.use(languageToSet);
        window.localStorage.setItem("coop_language", languageToSet);

        }
      }).catch(err => {
    //    this.loadingScreen.dismissLoading();
      });
    } 

  
  
  ngOnInit() {
    
     //Notification Permission Popup 
     this.platform.ready().then(() => {
      if (this.platform.is('android') || this.platform.is('ios')) {
        OneSignalPlugin.setAppId('6bacd441-2725-432b-9c48-0cf95e377be8');
      }
    });
    this.tempDetails = this.Router.getCurrentNavigation()?.extras.state;
    this.checkoutObj = this.tempDetails.checkoutData;
    this.allowPopupPushNoti();
    this.isLogin = this.tempDetails.withOutLogin;
     this.keyboard.hideFormAccessoryBar(false);
  }

  async allowPopupPushNoti() {
    const notiSetting = window.localStorage.getItem('eSIM_IsNotiSettingAllow');
    // Check if permission has not been previously granted
    if (notiSetting === 'no' || notiSetting === null) {
      if (this.platform.is('android') || this.platform.is('ios')) {
        // Prompt the user for push notification permission
        OneSignalPlugin.promptForPushNotificationsWithUserResponse((accepted) => {
          if (accepted) {
            window.localStorage.setItem('eSIM_IsNotiSettingAllow', 'yes');
  
            // Only fetch device token if the user has accepted
            this.getDeviceToken();
          }
        });
      }
    } else {
      // If permission was previously granted, directly fetch the device token
      this.getDeviceToken();
    }
  }

// Fetch the device token
getDeviceToken() {
  setTimeout(() => {
    OneSignalPlugin.getDeviceState((response) => {
      try {
        const storedPlayerId = window.localStorage.getItem('coop_PLAYER_ID');
        const playerId = storedPlayerId ?? response.userId;

        if (playerId) {
          this.googleLoginObj.deviceToken = playerId;
          this.facebookObj.deviceToken = playerId;
          this.loginObj.deviceToken = playerId;
          this.appleLoginObj.deviceToken = playerId;
          window.localStorage.setItem('coop_PLAYER_ID', playerId);
        }
      } catch (error) {
        console.error('Error fetching device token:', error);
      }
    });
  }, 500);
}  

  // Handle login submission
async submit() {
  if (this.validate()) {
    await this.loadingScreen.presentLoading();
    
    try {
      const credentials = JSON.stringify(this.loginObj);

      // Handle "Remember Me" functionality
      if (this.rememberMe) {
        window.localStorage.setItem('coop_credentials', credentials);
      } else {
        window.localStorage.removeItem('coop_credentials');
      }

      // API call for login
      const res: any = await this.service.loginService(this.loginObj);

      this.loadingScreen.dismissLoading();

      if (res.code === 200) {
        const userDetails = res.data[0]['data'];
        const authToken = res.data[0]['token'];
        // Fetch and store bundles after login
       this.userLanguage.language = window.localStorage.getItem("coop_language") || 'en';
       this.updateUserLanguage(authToken); 
        // Store login-related information in localStorage
        window.localStorage.setItem('coop_userDetails', JSON.stringify(userDetails));
        window.localStorage.setItem('coop_auth_token', authToken);
        window.localStorage.setItem('coop_loginType', "normal");
        window.localStorage.setItem('coop_emailSettings', res.data[0]['promotion_email']);
        window.localStorage.setItem('coop_promoSettings', res.data[0]['app_promotions']);
        window.localStorage.setItem('coop_paymentSettings', res.data[0]['app_payment']);
        window.localStorage.setItem('coop_serviceSettings', res.data[0]['app_service']);
        window.localStorage.setItem('coop_user_wallets', userDetails['user_wallet']);
        window.localStorage.setItem('coop_refer_balance', userDetails['referal_wallet']);
        window.localStorage.setItem('coop_refer_code', userDetails['referal_code']);
        console.log(userDetails['user_wallet']);

        // Show success message
        this.successMSGModal(
          this.translate.instant('SUCCESS_MSG_BUTTON'), 
          this.translate.instant('SUCCESS_MSG_TEXT'), 
          "2000"
        );

        // Handle navigation based on login state
        if (this.isLogin) {
          const loginPageUrl = this.Router.url;
          this.checkoutObj.id = userDetails['id'];
          const navigationExtras: NavigationExtras = {
            state: {
              checkoutData: this.checkoutObj,
              withOutLogin: this.isLogin,
              payBack: loginPageUrl
            }
          };
          this.Router.navigate(['/payment-days'], navigationExtras);
        } else {
          this.Router.navigate(['home-search']);
        }
      } else {
        this.errorMSGModal(
          this.translate.instant('ERROR_MSG_BUTTON'), 
          this.translate.instant('ERROR_MSG_TEXT')
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(
        this.translate.instant('ERROR_MSG_BUTTON'), 
        this.translate.instant('ERROR_MSG_TEXT')
      );
    }
  }
}

  // Validation start
  validate() {
    let emailValid = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (this.loginObj.email.trim() == '' && this.loginObj.password.trim() == '') {
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_BUTTON'), this.translate.instant('VALIDATION_MSG_EMPTY_FIELDS'));
      return false;
    }
    else if (this.loginObj.email.trim() == '') {
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_BUTTON'), this.translate.instant('VALIDATION_MSG_EMPTY_EMAIL'));
      return false;
    }
    else if (!emailValid.test(this.loginObj.email) && (this.loginObj.email != '')) {
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_BUTTON'), this.translate.instant('VALIDATION_MSG_INVALID_EMAIL'));
      return false;
    }
    else if (this.loginObj.password.trim() == '') {
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_BUTTON'), this.translate.instant('VALIDATION_MSG_EMPTY_PASSWORD'));
      return false;
    }
    return true;
  }

  gotoBack() {
    this.navController.pop();
  }

  gotoRegister() {
    let navigationExtras: NavigationExtras = {
      state: {
        checkoutData: this.checkoutObj,
        withOutLogin: this.isLogin
      }
    };
    this.Router.navigate(['/create-account'], navigationExtras);
  }

  gotoForgotPass() {
    this.Router.navigate(['/forgot-password']);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType == 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon == 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  clearInput() {
    this.loginObj.email = '';
    this.loginObj.password = '';
  }

  gotoTab1() {
    this.navController.navigateRoot('tab1');
  }
  gotoTab5() {
    this.navController.navigateRoot('tab5');
  }
  gotoStart() {
    this.navController.navigateRoot('start');
  }

  // Error Modal
  async errorMSGModal(buttonText: any, msg: any) {
    const modal = await this.modalController.create({
      component: PasswordErrorPage,
      componentProps: { 'value': msg , 'value1': buttonText}
    });

    modal.onDidDismiss();
    return await modal.present();
  }

  // Success Modal
  async successMSGModal(buttonText: any, msg: any, times: any) {
    const modal = await this.modalController.create({
      component: SuccessModelPage,
      componentProps: { 'value': msg, 'value1': buttonText, 'value2': times }
    });

    modal.onDidDismiss();
    return await modal.present();
  }

   /* SIgn in with google  */
   async loginWithGoogle() {
   // this.googleSuccess()
    await this.loadingScreen.presentLoading();
       
      const options = {
        prompt: 'consent',
        // other options...
      };
  
      this.googlePlus.login(options)
        .then(res => {
         // alert("Success" + JSON.stringify(res))
          this.loadingScreen.dismissLoading();
          this.googleSuccess(res)
        })
        .catch(err => {
         // alert("Error" + JSON.stringify(err));
        //  this.errorMSGModal(this.translate.instant('ERROR_MSG_BUTTON'), this.translate.instant('ERROR_MSG_TEXT'));
          this.loadingScreen.dismissLoading();
         // alert("Error" + JSON.stringify(err))
        });  
    }
  
    googleAttemp:any;

    
    async googleSuccess(googleRes:any) {
      //API call for Login section
      await this.loadingScreen.presentLoading();
      //this.googleLoginObj.userId ="11111111";
      //this.googleLoginObj.first_name = "Dinesh";
      //this.googleLoginObj.email = "dinesh1291186012@gmail.com";
      
      this.googleLoginObj.userId = googleRes.userId;
      this.googleLoginObj.first_name = googleRes.givenName;
      this.googleLoginObj.email = googleRes.email;
      
      this.service.googleLogin(this.googleLoginObj).then((resNew: any) => {
        this.loadingScreen.dismissLoading();
        if (resNew['code'] == 200) {
          const authToken =  resNew.data['token'];
         // Fetch and store bundles after login

          this.userLanguage.language = window.localStorage.getItem("coop_language") || 'en';
          this.updateUserLanguage(authToken); 
          window.localStorage.setItem('coop_userDetails', JSON.stringify(resNew.data['data']));
          window.localStorage.setItem('coop_auth_token', resNew.data['token']);
          this.googleAttemp = resNew.data['firstlogin'];
          window.localStorage.setItem('coop_loginType', "google");
          window.localStorage.setItem('coop_emailSettings',  resNew.data['promotion_email']);
          window.localStorage.setItem('coop_promoSettings', resNew.data['app_promotions']);
          window.localStorage.setItem('coop_paymentSettings', resNew.data['app_payment']);
          window.localStorage.setItem('coop_serviceSettings', resNew.data['app_service']);
          window.localStorage.setItem('coop_user_wallets', resNew.data['data']['user_wallet']);
          window.localStorage.setItem('coop_refer_balance', resNew.data['data']['referal_wallet']);
          window.localStorage.setItem('coop_refer_code', resNew.data['data']['referal_code']);
         
          if(this.googleAttemp == 0) //If New 
          this.successMSGModal(this.translate.instant('SUCCESS_MSG_BUTTON'), this.translate.instant('SUCCESS_MSG_TEXT_Wl'), "2000");
          else
          this.successMSGModal(this.translate.instant('SUCCESS_MSG_BUTTON'), this.translate.instant('SUCCESS_MSG_TEXT'), "2000");
         //Already registered  
         if(resNew.data['is_register'] == false)
         {

         if (this.isLogin == true) {
            const loginPageUrl = this.Router.url;
            this.checkoutObj.id = resNew.data['id'];
            let navigationExtras: NavigationExtras = {
              state: {
                checkoutData: this.checkoutObj,
                withOutLogin: this.isLogin,
                payBack: loginPageUrl
              }
            };
            this.Router.navigate(['/payment-days'], navigationExtras);
          } else {
            this.Router.navigate(['home-search']);
          } 
         }else{
    


         //First time
            const loginPageUrl = this.Router.url;
            this.checkoutObj.id = resNew.data['id'];
            let navigationExtras: NavigationExtras = {
              state: {
                checkoutData: this.checkoutObj,
                withOutLogin: this.isLogin,
                payBack: loginPageUrl
              }
            };
         this.Router.navigate(['signup-socialrefer'], navigationExtras);
         }
  
        } else {
          this.errorMSGModal(this.translate.instant('ERROR_MSG_BUTTON'), this.translate.instant('ERROR_MSG_TEXT'));
        }
      })
  }

}