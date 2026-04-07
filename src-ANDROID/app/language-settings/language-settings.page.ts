import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SuccessModelPage } from '../success-model/success-model.page';
import { ServicesService } from '../api/services.service';

@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.page.html',
  styleUrls: ['./language-settings.page.scss'],
})
export class LanguageSettingsPage implements OnInit {
  selectedLanguage: any;
  langugaeList: any = [];

  constructor(
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private navController: NavController,
    private service: ServicesService
  ) { }

  ngOnInit() {
    
    this.selectedLanguage = window.localStorage.getItem("coop_language") || 'en';
    this.translate.use(this.selectedLanguage);
    this.updateLanguageList();
  }




  updateLanguageList() {
    this.translate.get(['LONG_TEXT_EN', 'LONG_TEXT_FR']).subscribe(translations => {
      this.langugaeList = [
        { value: 'en', text: 'EN', long_text: translations['LONG_TEXT_EN'] },
        { value: 'fr', text: 'FR', long_text: translations['LONG_TEXT_FR'] }
      ];
    });
  }
  authToken:any=''; 
  userLanguage: any={'language' : ''};

  changeLanguage(event: any) {
    const selectedLang = event.detail.value;
    this.translate.use(selectedLang).subscribe(() => {
      window.localStorage.setItem("coop_Saved_Language", "Yes");
      window.localStorage.setItem("coop_language", selectedLang);
       this.userLanguage.language = selectedLang;
      this.authToken= window.localStorage.getItem("coop_auth_token");
      if (this.authToken== null) {
        console.log("Bundles not fetched");
      }
      else {
        this.updateUserLanguage();
      }
      this.updateLanguageList();
      this.successMSGModal(
        this.translate.instant('LANGUAGE_UPDATE'),
        this.translate.instant('LANGUAGE_CHANGED_SUCCESS'),
        3000
      );
  //    this.navController.pop();
    });
  }
  //Update user language 
 //Update user language 
 async updateUserLanguage()
 {
 this.service.updateUserLanguage(this.authToken, this.userLanguage).then((res: any) => {
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

 
  async successMSGModal(msg: string, buttonText: string, times: number) {
    const modal = await this.modalCtrl.create({
      component: SuccessModelPage,
      componentProps: { value: msg, value1: buttonText, value2: times }
    });

    modal.onDidDismiss();
    return await modal.present();
  }

  gotoBack() {
    this.navController.pop();
  }

  gotoTab1() {
    this.navController.navigateRoot('tab1');
  }

  gotoMarketPlace()
	  {
	    this.navController.navigateRoot('marketplace');
	  }
    
  gotoTab5() {
  if(window.localStorage.getItem('coop_auth_token')== null || window.localStorage.getItem('coop_auth_token')== '') 
this.navController.navigateRoot('tab5');
else
this.navController.navigateRoot('profile');
  }

  gotoHomeSearch() {
    this.navController.navigateRoot('home-search');
  }
}
