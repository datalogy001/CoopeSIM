import { Component, OnInit } from '@angular/core';
import { Platform, NavController, ToastController, PopoverController, ModalController, LoadingController } from "@ionic/angular";
import { Router, NavigationExtras } from '@angular/router';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { TermsPage } from '../terms/terms.page';
import { VerificationPage } from '../verification/verification.page';
import { ServicesService } from '../api/services.service';
import { LoadingScreenAppPage } from '../loading-screen-app/loading-screen-app.page';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import OneSignalPlugin from 'onesignal-cordova-plugin'
import { PasswordErrorPage } from '../password-error/password-error.page';
import { PasswordErrorModelPage } from '../password-error-model/password-error-model.page';
import { SuccessModelPage } from '../success-model/success-model.page';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ModalCodenotworkPage } from '../modal-codenotwork/modal-codenotwork.page';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  registerObj: any = { 'referal_code': '',  'first_name': '', 'last_name': '', 'password': '', 'email': '', 'isPrivacySelected': false, 'isTermsSelected': false, 'confirmPass': '', 'deviceToken': '' ,'lang' : ''};
  terms: any = [];
  privacy: any = [];
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-off-outline';

  currencyCode: any = '';
  tempDetails: any = [];
  checkoutObj: any = [];
  isLogin: any = '';
  receivedOtp: any = '';
  verifyObj: any = { 'name': '', 'email': '' };
  googleLoginObj: any = { 'userId': '', 'first_name': '', 'email': '', 'deviceToken': '', 'lang' : '',  'requested_ip' : '' };
  facebookObj: any = { 'userId': '', 'first_name': '', 'email': '', 'deviceToken': '', 'lang' : '',  'requested_ip' : '' };
  appleLoginObj: any = { 'apple_id': '', 'first_name': '', 'email': '', 'deviceToken': '' , 'lang' : '',  'requested_ip' : ''};
  plat: any;
  playerIds: any;
  IsfacebookObj: any = { 'userId': '' };

  // Inject services and controllers
  constructor(private translate: TranslateService, private googlePlus: GooglePlus,
    private loadingScreen: LoadingScreenAppPage,
    private platform: Platform,
    private loadCtr: LoadingController,
    private service: ServicesService,
    public popoverController: PopoverController,
    private Router: Router,
    private navController: NavController,
    private toastController: ToastController,
    private modalController: ModalController,
    private keyboard: Keyboard) { }

  // Toggle password visibility
  hideShowPassword() {
    this.passwordType = this.passwordType == 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon == 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  hideShowPassword1() {
    this.passwordType1 = this.passwordType1 == 'text' ? 'password' : 'text';
    this.passwordIcon1 = this.passwordIcon1 == 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  validateName(event: any, type: string) {
    const inputValue = event.target.value;
    // Regular expression to match any digit
    const regex = /\d/;
  
    // Check if the input contains any digits
    if (regex.test(inputValue)) {
      // If it contains digits, remove them from the input
      event.target.value = inputValue.replace(regex, '');
      // Update the model value accordingly
      if (type === 'first') {
        this.registerObj.first_name = event.target.value;
      } else {
        this.registerObj.last_name = event.target.value;
      }
    }
  }


  // Initialize component
  ngOnInit() {
    
    this.googleLoginObj.lang = window.localStorage.getItem("coop_language");
    this.facebookObj.lang = window.localStorage.getItem("coop_language");
    this.registerObj.lang = window.localStorage.getItem("coop_language");
    this.appleLoginObj.lang = window.localStorage.getItem("coop_language");
    this.googleLoginObj.requested_ip = window.localStorage.getItem('coop_IP') !=null? window.localStorage.getItem('coop_IP') : '';
    this.appleLoginObj.requested_ip = window.localStorage.getItem('coop_IP') !=null? window.localStorage.getItem('coop_IP') : '';

    this.tempDetails = this.Router.getCurrentNavigation()?.extras.state;
    this.checkoutObj = this.tempDetails.checkoutData;
    this.isLogin = this.tempDetails.withOutLogin;
    this.termsCondition();
    this.privacyPolicies();
      // Show the accessory bar with the "Done" button
      this.keyboard.hideFormAccessoryBar(false);

      // Listen for the keyboard's 'done' button event
      /*this.keyboard.onKeyboardHide().subscribe(() => {
        this.onDoneButton();
      }); */
  }

  /*onDoneButton() {
    // Handle the 'Done' button click event
    // Close the keyboard programmatically
    this.keyboard.hide();
    this.submit();
} */

  ionViewDidEnter() {
    this.playerIds = window.localStorage.getItem('coop_PLAYER_ID');
    if (this.playerIds != null) {
      this.googleLoginObj.deviceToken = this.playerIds;
      this.facebookObj.deviceToken = this.playerIds;
      this.registerObj.deviceToken = this.playerIds;
      this.appleLoginObj.deviceToken = this.playerIds;
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

     /* SIgn in with google  */
     async loginWithGoogle() {
      await this.loadingScreen.presentLoading();
        const options = {
          prompt: 'consent',
          // other options...
        };
    
        this.googlePlus.login(options)
          .then(res => {
            this.loadingScreen.dismissLoading();
            this.googleSuccess(res)
          })
          .catch(err => {
            this.loadingScreen.dismissLoading();
            console.log("Error" + JSON.stringify(err))
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
      this.successMSGModal(this.translate.instant('SUCCESS_MSG_BUTTON'), this.translate.instant('SUCCESS_MSG_TEXT_Wl'), "4000");
      else
      this.successMSGModal(this.translate.instant('SUCCESS_MSG_BUTTON'), this.translate.instant('SUCCESS_MSG_TEXT'), "4000");
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
    

   
  // Fetch privacy policies from service
  privacyPolicies() {
    this.service.getPrivacyPolicies().then((res: any) => {
      if (res.code == 200) {
        this.privacy = res.data[0];
      } else {
        this.privacy = [];
      }
    }).catch(err => {
      console.error('Error fetching privacy policies:', err);
    })
  }

  // Fetch terms and conditions from service
  termsCondition() {
    this.service.gettermsandCond().then((res: any) => {
      if (res.code == 200) {
        this.terms = res.data[0];
      } else {
        this.terms = [];
      }
    }).catch(err => {
      console.error('Error fetching terms and conditions:', err);
    })
  }

  // Navigate to different pages
  gotoTab1() {
    this.navController.navigateRoot('tab1');
  }

  gotoTab5() {
    this.navController.navigateRoot('tab5');
  }

  gotoHomeSearch() {
    this.navController.navigateRoot('home-search');
  }

  gotoBack() {
    this.navController.pop();
  }

  // Clear input field
  clearInput() {
    this.registerObj.email = '';
  }

  // Navigate to login page
  gotoLogin() {
    let navigationExtras: NavigationExtras = {
      state: {
        checkoutData: this.checkoutObj,
        withOutLogin: this.isLogin
      }
    };
    this.Router.navigate(['/login'], navigationExtras);
  }

  referObj:any={'referal_code' : ''};

  async gotoVerificationOTP()
  {
  await this.loadingScreen.presentLoading();
  this.verifyObj.name = this.registerObj.first_name;
  this.verifyObj.email = this.registerObj.email;
  this.service.verifyAccount(this.verifyObj).then((res: any) => {
    this.loadingScreen.dismissLoading();
    if (res.code == 200) {
      this.successMSGModal(this.translate.instant('VALIDATION_MSG_EMAIL_SENT'), this.translate.instant('VALIDATION_MSG_EMAIL_SENT_DESCRIPTION'), "2000");
      this.receivedOtp = res.data.OTP;
      this.sendOTPTOModel(this.receivedOtp);
    } else {

      this.errorMSGModal(res.message, this.translate.instant('VALIDATION_MSG_BUTTON_TRY_AGAIN'));
    }
  }).catch(err => {
    this.loadingScreen.dismissLoading();

    this.errorMSGModal( this.translate.instant('VALIDATION_MSG_EMAIL_ALREADY_REGISTERED'),this.translate.instant('VALIDATION_MSG_BUTTON_TRY_AGAIN'));
  })
}

  // Validate form inputs
  async submit() {
    if (this.validate()) {
      // If refere code added 
      if(this.registerObj.referal_code !='' &&   this.registerObj.referal_code !=null)
      {
        await this.loadingScreen.presentLoading();
        this.referObj.referal_code= this.registerObj.referal_code ;
        this.service.validate_refer_code(this.referObj).then((res: any) => {
          this.loadingScreen.dismissLoading();
          if (res.success == true) {
               this.gotoVerificationOTP();
          } else {
           // Error Model Start
           this.errorCodeMSGModal( this.translate.instant("code_didn't_work"),this.translate.instant('CONTINUE'));
           //End 

          }
        }).catch(err => {
          this.referObj.referal_code ='';
          this.registerObj.referal_code='';
          this.loadingScreen.dismissLoading();
          this.errorMSGModal( this.translate.instant('ERROR_MESSAGE'),this.translate.instant('VALIDATION_MSG_BUTTON_TRY_AGAIN'));
        })

      }else
      {

      await this.loadingScreen.presentLoading();
      this.verifyObj.name = this.registerObj.first_name;
      this.verifyObj.email = this.registerObj.email;
      this.service.verifyAccount(this.verifyObj).then((res: any) => {
        this.loadingScreen.dismissLoading();
        if (res.code == 200) {
          this.successMSGModal(this.translate.instant('VALIDATION_MSG_EMAIL_SENT'), this.translate.instant('VALIDATION_MSG_EMAIL_SENT_DESCRIPTION'), "2000");
          this.receivedOtp = res.data.OTP;
          this.sendOTPTOModel(this.receivedOtp);
        } else {

          this.errorMSGModal(res.message, this.translate.instant('VALIDATION_MSG_BUTTON_TRY_AGAIN'));
        }
      }).catch(err => {
        this.loadingScreen.dismissLoading();

        this.errorMSGModal( this.translate.instant('VALIDATION_MSG_EMAIL_ALREADY_REGISTERED'),this.translate.instant('VALIDATION_MSG_BUTTON_TRY_AGAIN'));
      })
    }
  }
  }

  // Navigate to verification page with OTP
  async sendOTPTOModel(otpcode: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        value: this.receivedOtp,
        value1: this.verifyObj.email,
        value2: this.verifyObj.name,
        isLogin: this.isLogin,
        checkoutObj: this.checkoutObj,
        registerObj: this.registerObj
      }
    };
    this.Router.navigate(['/verification'], navigationExtras);
  }


  // Validation function for form fields
  validate() {

  let emailValid = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  let passwordValid = /^(?=.*[A-Z])(?=.*[\W_])(?=.{6,}).*$/; // Regular expression for password validation

    if (this.registerObj.first_name.trim() == '') {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ENTER_FIRST_NAME'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    }
    else if (this.registerObj.last_name.trim() == '') {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ENTER_SURNAME'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    } else if (this.registerObj.email.trim() == '') {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ENTER_EMAIL'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    } else if (!emailValid.test(this.registerObj.email) && (this.registerObj.email != '')) {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ENTER_VALID_EMAIL'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    } else if (this.registerObj.password.trim() == '') {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ENTER_PASSWORD'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
 return false;
  } else if (!passwordValid.test(this.registerObj.password)) { // Password validation check
    this.loadingScreen.dismissLoading();
    this.errorMSGPASSWORDModal(this.translate.instant('VALIDATION_MSG_INVALID_PASSWORD'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
    return false;

    } else if (this.registerObj.confirmPass.trim() == '') {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_CONFIRM_PASSWORD'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    } else if (this.registerObj.password != this.registerObj.confirmPass) {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_PASSWORD_MISMATCH'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    } else if (this.registerObj.isPrivacySelected == false && this.registerObj.isTermsSelected == false) {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ACCEPT_PRIVACY_TERMS'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    } else if (this.registerObj.isPrivacySelected == false) {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ACCEPT_PRIVACY'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    } else if (this.registerObj.isTermsSelected == false) {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ACCEPT_TERMS'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    }
    return true;
  }
  // Open privacy policy modal
  async changePrivacyPolicies() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage,
      componentProps: { value: this.privacy }
    });
    return await modal.present();
  }

  // Open terms and conditions modal
  async changeTermsPopover() {
    const modal = await this.modalController.create({
      component: TermsPage,
      componentProps: { value: this.terms }
    });

    return await modal.present();
  }

  // Display success message modal
  async successMSGModal(header: string, message: string, time: any) {
    const modal = await this.modalController.create({
      component: SuccessModelPage,
      componentProps: {
        'value': header,
        'value1': message,
        'value2': time
      }
    });
    await modal.present();
  }

    // Display error message modal for Password 
  async errorMSGPASSWORDModal(header: string, message: string) {
    console.log(header);
    console.log(message);
    const modal = await this.modalController.create({
      component: PasswordErrorModelPage,
      componentProps: {
        'value': header,
        'value1': message,
      }
    });
    await modal.present();
  }

   // Display error message modal for Password 
   async errorCodeMSGModal(header: string, message: string) {
    console.log(header);
    console.log(message);
    const modal = await this.modalController.create({
      component: ModalCodenotworkPage ,
      componentProps: {
        'value': header,
        'value1': message,
      }
    });
    await modal.present();
  }


  // Display error message modal
  async errorMSGModal(header: string, message: string) {
    console.log(header);
    console.log(message);
    const modal = await this.modalController.create({
      component: PasswordErrorPage,
      componentProps: {
        'value': header,
        'value1': message,
      }
    });
    await modal.present();
  }

  // Navigate to privacy policy page
  async gotoPrivacy() {
    let navigationExtras: NavigationExtras = {
      state: {
        privacy: this.privacy,
      }
    };
    this.Router.navigate(['/privacy'], navigationExtras);
  }

  // Navigate to terms and conditions page
  async gotoTerms() {
    let navigationExtras: NavigationExtras = {
      state: {
        terms: this.terms,
      }
    };
    this.Router.navigate(['/terms-conditions'], navigationExtras);
  }

  async gotoCodenotworking() {
      const modal = await this.modalController.create({
        component: ModalCodenotworkPage
      });
  
      modal.onDidDismiss();
      return await modal.present();
    }

}
