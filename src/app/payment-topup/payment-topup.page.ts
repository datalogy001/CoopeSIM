import { ConfirmContinuePage } from '../confirm-continue/confirm-continue.page';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Platform, NavController, ToastController, PopoverController, ModalController, LoadingController } from "@ionic/angular";
import { ServicesService } from '../api/services.service';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingScreenAppPage } from '../loading-screen-app/loading-screen-app.page';
import { PasswordErrorPage } from '../password-error/password-error.page';
import { SuccessModelPage } from '../success-model/success-model.page';
import { ProcessingBarFpayTopupPage } from '../processing-bar-fpay-topup/processing-bar-fpay-topup.page';
import { ProcessingBarGooglePayTopupPage } from '../processing-bar-google-pay-topup/processing-bar-google-pay-topup.page';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { TranslateService } from '@ngx-translate/core';
import { SuccessModelEsimPage } from '../success-model-esim/success-model-esim.page';
import { PermissionModalPage } from '../permission-modal/permission-modal.page';
import Swiper from 'swiper';

declare var sgap: any;

@Component({
  selector: 'app-payment-topup',
  templateUrl: './payment-topup.page.html',
  styleUrls: ['./payment-topup.page.scss'],
})
export class PaymentTopupPage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  private stripe: Stripe | null = null;
  tempDetails: any = [];
  checkoutObj: any = { 'status': '', 'amount': '', 'currency': '', 'paymentId': '', 'PayerID': '', 'token': '', 'payment_method' : '', 'payment_intent':''};
  accessToken: any = '';
  userDetails: any = [];
  paymentType: any = '';
  card_id: any;
  currencyCode: any = 'GBP';
  selectedCards: boolean[] = [];
  isData: any = true;
  stripe_key: any = this.service.stripePubliserKey;
  stripeCardObj: any = { 'card_id': ''};
  paymentMethod: any = [];
  isDataAvail: any = true;
  clientSecret: any = '';
  paymentIntentObj: any = { 'amount': '', 'currency': '', 'plan': '' };
  cardIntentObj: any = { 'card_id': '', 'intent_id': '' };
  types: any = '';
  isCardSelected: any = false;
  loading = false;
  creditDebitType: any = '';
  googlePayType: any = '';
  cardList: any = [];

  
    constructor(private translate: TranslateService,private popoverController: PopoverController, private loadingScreen: LoadingScreenAppPage, private platform: Platform, private loadCtr: LoadingController, private service: ServicesService, private navController: NavController, private toastController: ToastController, private Router: Router, private modalController: ModalController) {
  this.platform.ready().then(() => {
  if ((this.platform.is('android') || this.platform.is('ios')) && typeof sgap !== 'undefined') {
    sgap.setKey(this.service.stripePubliserKey);
  } else {
    console.warn('Stripe plugin not available or running in browser.');
    // Optionally mock stripe behavior or skip
  }
});
    }

    swiperSlideChanged(e: any) {
      //console.log('changed: ', e);
    }
  
    swiperReady() {
      this.swiper = this.swiperRef?.nativeElement.swiper;
    }

    async initStripeFun() {
      this.stripe = await loadStripe(this.service.stripePubliserKey);
      if (!this.stripe) {
        console.error('Stripe failed to initialize');
        return;
      }
    }

  ionViewDidEnter() {
    this.getCreditCards();
  }

  
  async getCreditCards() {
    this.service.getCreditCardDetails(this.accessToken).then((res: any) => {
      if (res.code == 200) {
        if (res.data[0].length > 0) {
          this.cardList = res.data[0];
          this.selectedCards = new Array(this.cardList.length).fill(false);
        }
        else {
          this.cardList = [];
        }
      } else {
        this.cardList = [];
      }
    }).catch(err => {
      this.cardList = [];
    })

  }

  // Function to handle radio button click
  cartOpt(index: number, cardDetails: any) {
    // Reset all selections
    this.selectedCards.fill(false);
    // Set the selected card
    this.isCardSelected = true;
    this.selectedCards[index] = true;
    this.stripeCardObj.card_id = cardDetails.id;
    this.paymentType = '';
    //console.log("::" + this.isCardSelected);
  }

  onCreditDebitTypeChange(event: any) {
    this.creditDebitType = event.detail.value;
    this.googlePayType = '';
  }

  
  onGooglePayTypeChange(event: any) {
    this.googlePayType = event.detail.value;
    this.selectedCards.fill(false);
    this.isCardSelected = false;
    this.creditDebitType = '';
  }

  selectedPaymentType: string = 'google-pay'; // Set Gogole Pay as the default selected option
  // Load the available payment methods
  loadPaymentMethods() {
    this.paymentMethod = [{ type: 2, text: 'Google Pay', img: 'assets/img/google-pay.png' }];
    this.selectedPaymentType = 'google-pay'; // Apple Pay selected by default
  }

  ngOnInit() {
     this.paymentType = '';
        this.loadPaymentMethods();
        this.initStripeFun();
        this.paymentMethod = [{ 'type': 1, 'text': 'Credit/Debit', 'img': 'assets/img/credit-card-dark.png' }, { 'type': 2, 'text': 'Google Pay', 'img': 'assets/img/googlepay.png' }];
        this.tempDetails = this.Router.getCurrentNavigation()?.extras.state;
    
        this.checkoutObj = this.tempDetails.topupAMTData;

        console.log(JSON.stringify(this.checkoutObj));

        if (window.localStorage.getItem('coop_currency') == null) {
          this.currencyCode = 'GBP';
        } else {
          this.currencyCode = window.localStorage.getItem('coop_currency');
        }
        
        this.accessToken = window.localStorage.getItem('coop_auth_token');
        this.userDetails = window.localStorage.getItem('coop_userDetails');
        this.userDetails = JSON.parse(this.userDetails);
        this.checkoutObj.PayerID= this.userDetails.id
        console.log("Main card" + this.checkoutObj.PayerID);
  }

  setupGooglePay(totalAmount:any,currency:any) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      sgap.setKey(this.service.stripePubliserKey);
      sgap.isReadyToPay().then(() => {
        sgap
          .requestPayment(totalAmount.toString(), currency)
          .then((responsePayment: any) => {
            this.managingAppLogs("From App Step 2 Credit-topup: Google Pay Native SDK Success: " + JSON.stringify(responsePayment) ,this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
            this.actualStripePaymentGooglrPay(this.clientSecret, responsePayment);
          })
          .catch((errorPayment: any) => {
               this.managingAppLogs("From App Step 2 Credit-topup: Google Pay Native SDK Error: " + JSON.stringify(errorPayment) ,this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
         
            this.errorMSGModal(this.translate.instant('ERROR_TRY_AGAIN'), this.translate.instant('payment_cancelled') );
          });
      }).catch((error: any) => {
        this.managingAppLogs("From App Step 2 Credit-topup: Google Pay Native SDK Payment Cancelled : " + JSON.stringify(error) ,this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
        this.errorMSGModal(this.translate.instant('ERROR_TRY_AGAIN'), this.translate.instant('payment_cancelled') );
      });
    } else {
      console.log('We are in the web environment, Google Pay is not available.');
    } 
  }

  
 // Step 3: Actual payment from App
async actualStripePaymentGooglrPay(client_secret: string, token: string) {
  if (!this.stripe) {
    console.error('Stripe failed to initialize');
    return;
  }

  // Use payment_method_data with the token provided by Google Pay or Apple Pay
  const { error: confirmError, paymentIntent } = await this.stripe.confirmCardPayment(client_secret, {
    payment_method: {
      card: {
        token: token, // Correct way to pass the token
      },
    },
  });

  if (confirmError) {
    this.loadingScreen.dismissLoading();
    this.managingAppLogs("From App Step 3 Credit-topup: Google Pay confirmation Payment Failed:" + JSON.stringify(confirmError),this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
    this.errorMSGModal(
      this.translate.instant('ERROR_TRY_AGAIN'),
      this.translate.instant('PAYMENT_CONFIRMATION_FAILED')
    );
  } else if (paymentIntent && paymentIntent.status == 'succeeded') {
    
    this.checkoutObj.payment_intent = paymentIntent;
    this.loadingScreen.dismissLoading();
    this.managingAppLogs("From App Step 3 Credit-topup: Google Pay Confirmation Payment Success:" + JSON.stringify(paymentIntent),this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);   
    const modalFirstOpt = await this.modalController.create({
      component: ProcessingBarGooglePayTopupPage,
      componentProps: { value: this.checkoutObj, value1: this.accessToken},
    });
    modalFirstOpt.onDidDismiss();
    return await modalFirstOpt.present();
  }
}


  //Step 3 : Actual payment from App
  async actualStripePayment(client_secret: any, payment_method: any) {
    if (!this.stripe) {
      console.error('Stripe failed to initialize');
      return;
    }

    const { error: confirmError, paymentIntent } = await this.stripe.confirmCardPayment(client_secret, {
      payment_method: payment_method
    });

    if (confirmError) {
      this.loadingScreen.dismissLoading();
      this.managingAppLogs("From App Step 3 Credit Topup: Card Confirmation Payment Failed:" + JSON.stringify(confirmError),this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
      this.errorMSGModal( this.translate.instant('ERROR_TRY_AGAIN'),  this.translate.instant('PAYMENT_CONFIRMATION_FAILED'));
    } else if (paymentIntent && paymentIntent.status == 'succeeded') {
      this.checkoutObj.payment_intent = paymentIntent;
      // For Card selected Credit/debit card 
      console.log("Card PARAM=> " + JSON.stringify(this.checkoutObj));
      this.managingAppLogs("From App Step 3 Credit Topup: Card Confirmation Payment Success:" + JSON.stringify(paymentIntent),this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
      this.loadingScreen.dismissLoading();
      const modalFirstOpt = await this.modalController.create({
        component: ProcessingBarFpayTopupPage,
        componentProps: { 'value': this.checkoutObj, 'value1': this.accessToken }
      });
      modalFirstOpt.onDidDismiss();
      return await modalFirstOpt.present();
      //End code  
    }

  }

  // Common functions for Logs 
  async managingAppLogs(label: string, currencyCode: string, amount: number, plan: string): Promise<void> {
  let devicePlatform = 'Unknown';

  if (this.platform.is('android')) {
    devicePlatform = 'Android';
  } else if (this.platform.is('ios')) {
    devicePlatform = 'iOS';
  } else if (this.platform.is('desktop')) {
    devicePlatform = 'Desktop';
  } else if (this.platform.is('mobileweb')) {
    devicePlatform = 'Mobile Web';
  }

  const paymentEvent = {
    label,
    data: {
      Action: label,
      Device: devicePlatform,
      Customer_name: `${this.userDetails.first_name}${this.userDetails.last_name ? ' ' + this.userDetails.last_name : ''}`,
      Customer_email: this.userDetails.email,
      Amount: amount,
      Currency: currencyCode,
      Plan: plan
    }
  };

  console.log('Event log:', paymentEvent);

 try {
  const response = await this.service.appSideLogs(paymentEvent, this.accessToken) as { code: number };
  if (response.code === 200) {
    console.log('Logs managed successfully');
  } else {
    console.error('Error managing logs:', response);
  }
} catch (error) {
  console.error('Server error while managing logs:', error);
}
}

// End of Common functions for Logs 

   async proceedForPayment() {
  
       if (this.selectedPaymentType == 'google-pay') {
          //First step: Generate client secret key
          await this.loadingScreen.presentLoading();
          this.paymentIntentObj.currency = this.currencyCode;
          this.paymentIntentObj.amount = this.checkoutObj.amount;
          this.paymentIntentObj.plan = "TOP-UP";
          this.managingAppLogs("From App Step 1 Credit-Topup: Google Pay Intent Started",this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
          this.service.createPaymentIntent(this.paymentIntentObj, this.accessToken).then((res: any) => {
            if (res.code == 200) {
              this.clientSecret = res.data[0].client_secret;
              this.loadingScreen.dismissLoading();
              this.setupGooglePay(this.checkoutObj.amount,  this.currencyCode);
            } else {
              this.loadingScreen.dismissLoading();
              this.errorMSGModal( this.translate.instant('ERROR_TRY_AGAIN'),  this.translate.instant('ERROR_MESSAGE'));
              this.clientSecret = '';
            }
          }).catch(err => {
            this.loadingScreen.dismissLoading();
            this.errorMSGModal( this.translate.instant('ERROR_TRY_AGAIN'),  this.translate.instant('ERROR_MESSAGE'));
            this.clientSecret = '';
          })
           // }else{
          //  console.log("We are in web");
           // }   
        }else{
        if (this.cardList.length > 0 && this.isCardSelected == false) {
          this.gotoPernissionModel();
        }
        else {
        if (this.isCardSelected == true) {
  
          await this.loadingScreen.presentLoading();
          // Step 1-> Get Client secret key from Server side 
          this.paymentIntentObj.currency = this.currencyCode;
          this.paymentIntentObj.amount = this.checkoutObj.amount;
          this.paymentIntentObj.plan = "TOP-UP";
          this.managingAppLogs("From App Step 1 Credit-Topup Card Intent Started",this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
          this.service.createPaymentIntent(this.paymentIntentObj, this.accessToken).then((res: any) => {
  
            if (res.code == 200) {
              // this.presentToast("Initialize Payment Intent", "Success");
              this.clientSecret = res.data[0].client_secret;
              this.cardIntentObj.card_id = this.stripeCardObj.card_id;
              this.cardIntentObj.intent_id = res.data[0].id;
              this.callPaymentIntentFromApp(this.cardIntentObj);
  
            } else {
              this.loadingScreen.dismissLoading();
              this.errorMSGModal( this.translate.instant('ERROR_TRY_AGAIN'),  this.translate.instant('ERROR_MESSAGE'));
              this.clientSecret = '';
            }
          }).catch(err => {
            this.loadingScreen.dismissLoading();
            this.errorMSGModal( this.translate.instant('ERROR_TRY_AGAIN'),  this.translate.instant('ERROR_MESSAGE'));
            this.clientSecret = '';
          })
  
  
        }
        else {
          let navigationExtras: NavigationExtras = {
            state: {
              stripeCardData: this.checkoutObj,
              fromPayment: true
            }
          };
          this.Router.navigate(['/add-card-fpay-topup-wallet'], navigationExtras);
        } 
      }
    }
  
    }

    //Step 2 : Send Intent and card Id to server 
  async callPaymentIntentFromApp(paymentObj: any) {
    this.managingAppLogs("From App Step 2 Credit Top-up: Payment Intent Started",this.currencyCode,  this.paymentIntentObj.amount, this.paymentIntentObj.plan);
    this.service.paymentCardIntent(paymentObj, this.accessToken).then((res: any) => {
      if (res.code == 200) {
        this.actualStripePayment(this.clientSecret, res.data[0].payment_method);
      } else {
      }
    }).catch(err => {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal( this.translate.instant('ERROR_TRY_AGAIN'),  this.translate.instant('UNABLE_CREATE_INTENT'));
    })
  }

  async gotoPernissionModel() {
    const modal = await this.modalController.create({
      component: PermissionModalPage,
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data.inputValue == true) {
        let navigationExtras: NavigationExtras = {
          state: {
            stripeCardData: this.checkoutObj,
            fromPayment: true
          }
        };
        console.log("Main card 3" + this.checkoutObj.PayerID);
        this.Router.navigate(['/add-card-fpay-topup-wallet'], navigationExtras);
      } else {

        // Reset all selections and choose first
        this.selectedCards.fill(false);
        // Set the selected card
        this.isCardSelected = true;
        this.selectedCards[0] = true;
        this.stripeCardObj.card_id = this.cardList[0]['id'];
        this.paymentType = '';
      }
    });

    return await modal.present();
  }

   // Event handler for radio button change
   onPaymentTypeChange(event: any) {
    this.selectedPaymentType = event.detail.value;
    if (this.selectedPaymentType == 'google-pay') {
      this.creditDebitType = '';
      this.isCardSelected = false;
    } else if (this.selectedPaymentType == 'credit-debit') {
      this.isCardSelected = false;
    }
 
  }



//Error Modal
async errorMSGModal(buttonText: any, msg: any) {
  const modal = await this.modalController.create({
    component: PasswordErrorPage,
    componentProps: { 'value': msg, 'value1': buttonText }
  });

  modal.onDidDismiss();
  return await modal.present();
}

  gotoBack() {
    this.navController.pop();
  }

  gototab5() {
    this.navController.navigateRoot('tab5');
  }

  gototab1() {
    this.navController.navigateRoot('tab1');
  }

  
	gotoMarketPlace()
  {
    this.navController.navigateRoot('marketplace');
  }


}
