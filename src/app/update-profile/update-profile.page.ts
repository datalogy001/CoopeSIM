import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, ModalController, PopoverController } from '@ionic/angular';
import { LoadingScreenAppPage } from '../loading-screen-app/loading-screen-app.page';
import { SuccessModelPage } from '../success-model/success-model.page';
import { PasswordErrorPage } from '../password-error/password-error.page';
import { ServicesService } from '../api/services.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';
import { ChooseCountryPage } from '../choose-country/choose-country.page';
import { ModalDeleteprofilepicPage } from '../modal-deleteprofilepic/modal-deleteprofilepic.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalUploadProfileImagePage } from '../modal-upload-profile-image/modal-upload-profile-image.page';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { CountryCodeModelPage} from '../country-code-model/country-code-model.page';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {

  profileObj: any = { 'first_name': '', 'last_name': '', 'email': '', 'profile_image' :'', 'date_of_birth': '', 'mobile_number': '' };
  tempDetails: any = [];
  token: any = '';
  isSavedDetails: any = false;

  countryCodeObj: any = {
    flag: '',
    code: ''
  };

  countryList : any = [
  { "name": "Afghanistan", "region": "Asia", "iso": "AF", "countrycode": "+93" },
  { "name": "Albania", "region": "Europe", "iso": "AL", "countrycode": "+355" },
  { "name": "Algeria", "region": "Africa", "iso": "DZ", "countrycode": "+213" },
  { "name": "Andorra", "region": "Europe", "iso": "AD", "countrycode": "+376" },
  { "name": "Angola", "region": "Africa", "iso": "AO", "countrycode": "+244" },
  { "name": "Antigua and Barbuda", "region": "North America", "iso": "AG", "countrycode": "+1-268" },
  { "name": "Argentina", "region": "South America", "iso": "AR", "countrycode": "+54" },
  { "name": "Armenia", "region": "Asia", "iso": "AM", "countrycode": "+374" },
  { "name": "Australia", "region": "Oceania", "iso": "AU", "countrycode": "+61" },
  { "name": "Austria", "region": "Europe", "iso": "AT", "countrycode": "+43" },
  { "name": "Azerbaijan", "region": "Asia", "iso": "AZ", "countrycode": "+994" },
  { "name": "Bahamas", "region": "North America", "iso": "BS", "countrycode": "+1-242" },
  { "name": "Bahrain", "region": "Middle East", "iso": "BH", "countrycode": "+973" },
  { "name": "Bangladesh", "region": "Asia", "iso": "BD", "countrycode": "+880" },
  { "name": "Barbados", "region": "North America", "iso": "BB", "countrycode": "+1-246" },
  { "name": "Belarus", "region": "Europe", "iso": "BY", "countrycode": "+375" },
  { "name": "Belgium", "region": "Europe", "iso": "BE", "countrycode": "+32" },
  { "name": "Belize", "region": "North America", "iso": "BZ", "countrycode": "+501" },
  { "name": "Benin", "region": "Africa", "iso": "BJ", "countrycode": "+229" },
  { "name": "Bhutan", "region": "Asia", "iso": "BT", "countrycode": "+975" },
  { "name": "Bolivia", "region": "South America", "iso": "BO", "countrycode": "+591" },
  { "name": "Bosnia and Herzegovina", "region": "Europe", "iso": "BA", "countrycode": "+387" },
  { "name": "Botswana", "region": "Africa", "iso": "BW", "countrycode": "+267" },
  { "name": "Brazil", "region": "South America", "iso": "BR", "countrycode": "+55" },
  { "name": "Brunei", "region": "Asia", "iso": "BN", "countrycode": "+673" },
  { "name": "Bulgaria", "region": "Europe", "iso": "BG", "countrycode": "+359" },
  { "name": "Burkina Faso", "region": "Africa", "iso": "BF", "countrycode": "+226" },
  { "name": "Burundi", "region": "Africa", "iso": "BI", "countrycode": "+257" },
  { "name": "Cabo Verde", "region": "Africa", "iso": "CV", "countrycode": "+238" },
  { "name": "Cambodia", "region": "Asia", "iso": "KH", "countrycode": "+855" },
  { "name": "Cameroon", "region": "Africa", "iso": "CM", "countrycode": "+237" },
  { "name": "Canada", "region": "North America", "iso": "CA", "countrycode": "+1" },
  { "name": "Central African Republic", "region": "Africa", "iso": "CF", "countrycode": "+236" },
  { "name": "Chad", "region": "Africa", "iso": "TD", "countrycode": "+235" },
  { "name": "Chile", "region": "South America", "iso": "CL", "countrycode": "+56" },
  { "name": "China", "region": "Asia", "iso": "CN", "countrycode": "+86" },
  { "name": "Colombia", "region": "South America", "iso": "CO", "countrycode": "+57" },
  { "name": "Comoros", "region": "Africa", "iso": "KM", "countrycode": "+269" },
  { "name": "Congo (Republic)", "region": "Africa", "iso": "CG", "countrycode": "+242" },
  { "name": "Congo (Democratic Republic)", "region": "Africa", "iso": "CD", "countrycode": "+243" },
  { "name": "Costa Rica", "region": "North America", "iso": "CR", "countrycode": "+506" },
  { "name": "Croatia", "region": "Europe", "iso": "HR", "countrycode": "+385" },
  { "name": "Cuba", "region": "North America", "iso": "CU", "countrycode": "+53" },
  { "name": "Cyprus", "region": "Europe", "iso": "CY", "countrycode": "+357" },
  { "name": "Czech Republic", "region": "Europe", "iso": "CZ", "countrycode": "+420" },
  { "name": "Denmark", "region": "Europe", "iso": "DK", "countrycode": "+45" },
  { "name": "Djibouti", "region": "Africa", "iso": "DJ", "countrycode": "+253" },
  { "name": "Dominica", "region": "North America", "iso": "DM", "countrycode": "+1-767" },
  { "name": "Dominican Republic", "region": "North America", "iso": "DO", "countrycode": "+1-809" },
  { "name": "Ecuador", "region": "South America", "iso": "EC", "countrycode": "+593" },
  { "name": "Egypt", "region": "Africa", "iso": "EG", "countrycode": "+20" },
  { "name": "El Salvador", "region": "North America", "iso": "SV", "countrycode": "+503" },
  { "name": "Equatorial Guinea", "region": "Africa", "iso": "GQ", "countrycode": "+240" },
  { "name": "Eritrea", "region": "Africa", "iso": "ER", "countrycode": "+291" },
  { "name": "Estonia", "region": "Europe", "iso": "EE", "countrycode": "+372" },
  { "name": "Eswatini", "region": "Africa", "iso": "SZ", "countrycode": "+268" },
  { "name": "Ethiopia", "region": "Africa", "iso": "ET", "countrycode": "+251" },
  { "name": "Fiji", "region": "Oceania", "iso": "FJ", "countrycode": "+679" },
  { "name": "Finland", "region": "Europe", "iso": "FI", "countrycode": "+358" },
  { "name": "France", "region": "Europe", "iso": "FR", "countrycode": "+33" },
  { "name": "Gabon", "region": "Africa", "iso": "GA", "countrycode": "+241" },
  { "name": "Gambia", "region": "Africa", "iso": "GM", "countrycode": "+220" },
  { "name": "Georgia", "region": "Asia", "iso": "GE", "countrycode": "+995" },
  { "name": "Germany", "region": "Europe", "iso": "DE", "countrycode": "+49" },
  { "name": "Ghana", "region": "Africa", "iso": "GH", "countrycode": "+233" },
  { "name": "Greece", "region": "Europe", "iso": "GR", "countrycode": "+30" },
  { "name": "Grenada", "region": "North America", "iso": "GD", "countrycode": "+1-473" },
  { "name": "Guatemala", "region": "North America", "iso": "GT", "countrycode": "+502" },
  { "name": "Guinea", "region": "Africa", "iso": "GN", "countrycode": "+224" },
  { "name": "Guinea-Bissau", "region": "Africa", "iso": "GW", "countrycode": "+245" },
  { "name": "Guyana", "region": "South America", "iso": "GY", "countrycode": "+592" },
  { "name": "Haiti", "region": "North America", "iso": "HT", "countrycode": "+509" },
  { "name": "Honduras", "region": "North America", "iso": "HN", "countrycode": "+504" },
  { "name": "Hungary", "region": "Europe", "iso": "HU", "countrycode": "+36" },
  { "name": "Iceland", "region": "Europe", "iso": "IS", "countrycode": "+354" },
  { "name": "India", "region": "Asia", "iso": "IN", "countrycode": "+91" },
  { "name": "Indonesia", "region": "Asia", "iso": "ID", "countrycode": "+62" },
  { "name": "Iran", "region": "Middle East", "iso": "IR", "countrycode": "+98" },
  { "name": "Iraq", "region": "Middle East", "iso": "IQ", "countrycode": "+964" },
  { "name": "Ireland", "region": "Europe", "iso": "IE", "countrycode": "+353" },
  { "name": "Israel", "region": "Middle East", "iso": "IL", "countrycode": "+972" },
  { "name": "Italy", "region": "Europe", "iso": "IT", "countrycode": "+39" },
  { "name": "Jamaica", "region": "North America", "iso": "JM", "countrycode": "+1-876" },
  { "name": "Japan", "region": "Asia", "iso": "JP", "countrycode": "+81" },
  { "name": "Jordan", "region": "Middle East", "iso": "JO", "countrycode": "+962" },
  { "name": "Kazakhstan", "region": "Asia", "iso": "KZ", "countrycode": "+7" },
  { "name": "Kenya", "region": "Africa", "iso": "KE", "countrycode": "+254" },
  { "name": "Kiribati", "region": "Oceania", "iso": "KI", "countrycode": "+686" },
  { "name": "Kuwait", "region": "Middle East", "iso": "KW", "countrycode": "+965" },
  { "name": "Kyrgyzstan", "region": "Asia", "iso": "KG", "countrycode": "+996" },
  { "name": "Lao People's Democratic Republic", "region": "Asia", "iso": "LA", "countrycode": "+856" },
  { "name": "Latvia", "region": "Europe", "iso": "LV", "countrycode": "+371" },
  { "name": "Lebanon", "region": "Middle East", "iso": "LB", "countrycode": "+961" },
  { "name": "Lesotho", "region": "Africa", "iso": "LS", "countrycode": "+266" },
  { "name": "Liberia", "region": "Africa", "iso": "LR", "countrycode": "+231" },
  { "name": "Libya", "region": "Africa", "iso": "LY", "countrycode": "+218" },
  { "name": "Liechtenstein", "region": "Europe", "iso": "LI", "countrycode": "+423" },
  { "name": "Lithuania", "region": "Europe", "iso": "LT", "countrycode": "+370" },
  { "name": "Luxembourg", "region": "Europe", "iso": "LU", "countrycode": "+352" },
  { "name": "Madagascar", "region": "Africa", "iso": "MG", "countrycode": "+261" },
  { "name": "Malawi", "region": "Africa", "iso": "MW", "countrycode": "+265" },
  { "name": "Malaysia", "region": "Asia", "iso": "MY", "countrycode": "+60" },
  { "name": "Maldives", "region": "Asia", "iso": "MV", "countrycode": "+960" },
  { "name": "Mali", "region": "Africa", "iso": "ML", "countrycode": "+223" },
  { "name": "Malta", "region": "Europe", "iso": "MT", "countrycode": "+356" },
  { "name": "Marshall Islands", "region": "Oceania", "iso": "MH", "countrycode": "+692" },
  { "name": "Mauritania", "region": "Africa", "iso": "MR", "countrycode": "+222" },
  { "name": "Mauritius", "region": "Africa", "iso": "MU", "countrycode": "+230" },
  { "name": "Mexico", "region": "North America", "iso": "MX", "countrycode": "+52" },
  { "name": "Micronesia", "region": "Oceania", "iso": "FM", "countrycode": "+691" },
  { "name": "Moldova", "region": "Europe", "iso": "MD", "countrycode": "+373" },
  { "name": "Monaco", "region": "Europe", "iso": "MC", "countrycode": "+377" },
  { "name": "Mongolia", "region": "Asia", "iso": "MN", "countrycode": "+976" },
  { "name": "Montenegro", "region": "Europe", "iso": "ME", "countrycode": "+382" },
  { "name": "Morocco", "region": "Africa", "iso": "MA", "countrycode": "+212" },
  { "name": "Mozambique", "region": "Africa", "iso": "MZ", "countrycode": "+258" },
  { "name": "Myanmar", "region": "Asia", "iso": "MM", "countrycode": "+95" },
  { "name": "Namibia", "region": "Africa", "iso": "NA", "countrycode": "+264" },
  { "name": "Nauru", "region": "Oceania", "iso": "NR", "countrycode": "+674" },
  { "name": "Nepal", "region": "Asia", "iso": "NP", "countrycode": "+977" },
  { "name": "Netherlands", "region": "Europe", "iso": "NL", "countrycode": "+31" },
  { "name": "New Zealand", "region": "Oceania", "iso": "NZ", "countrycode": "+64" },
  { "name": "Nicaragua", "region": "North America", "iso": "NI", "countrycode": "+505" },
  { "name": "Niger", "region": "Africa", "iso": "NE", "countrycode": "+227" },
  { "name": "Nigeria", "region": "Africa", "iso": "NG", "countrycode": "+234" },
  { "name": "North Korea", "region": "Asia", "iso": "KP", "countrycode": "+850" },
  { "name": "North Macedonia", "region": "Europe", "iso": "MK", "countrycode": "+389" },
  { "name": "Norway", "region": "Europe", "iso": "NO", "countrycode": "+47" },
  { "name": "Oman", "region": "Middle East", "iso": "OM", "countrycode": "+968" },
  { "name": "Pakistan", "region": "Asia", "iso": "PK", "countrycode": "+92" },
  { "name": "Palau", "region": "Oceania", "iso": "PW", "countrycode": "+680" },
  { "name": "Palestine", "region": "Middle East", "iso": "PS", "countrycode": "+970" },
  { "name": "Panama", "region": "North America", "iso": "PA", "countrycode": "+507" },
  { "name": "Papua New Guinea", "region": "Oceania", "iso": "PG", "countrycode": "+675" },
  { "name": "Paraguay", "region": "South America", "iso": "PY", "countrycode": "+595" },
  { "name": "Peru", "region": "South America", "iso": "PE", "countrycode": "+51" },
  { "name": "Philippines", "region": "Asia", "iso": "PH", "countrycode": "+63" },
  { "name": "Poland", "region": "Europe", "iso": "PL", "countrycode": "+48" },
  { "name": "Portugal", "region": "Europe", "iso": "PT", "countrycode": "+351" },
    { "name": "Qatar", "region": "Middle East", "iso": "QA", "countrycode": "+974" },
  { "name": "Republic of Korea (South Korea)", "region": "Asia", "iso": "KR", "countrycode": "+82" },
  { "name": "Romania", "region": "Europe", "iso": "RO", "countrycode": "+40" },
  { "name": "Russian Federation", "region": "Europe/Asia", "iso": "RU", "countrycode": "+7" },
  { "name": "Rwanda", "region": "Africa", "iso": "RW", "countrycode": "+250" },
  { "name": "Saint Kitts and Nevis", "region": "North America", "iso": "KN", "countrycode": "+1-869" },
  { "name": "Saint Lucia", "region": "North America", "iso": "LC", "countrycode": "+1-758" },
  { "name": "Saint Vincent and the Grenadines", "region": "North America", "iso": "VC", "countrycode": "+1-784" },
  { "name": "Samoa", "region": "Oceania", "iso": "WS", "countrycode": "+685" },
  { "name": "San Marino", "region": "Europe", "iso": "SM", "countrycode": "+378" },
  { "name": "Sao Tome and Principe", "region": "Africa", "iso": "ST", "countrycode": "+239" },
  { "name": "Saudi Arabia", "region": "Middle East", "iso": "SA", "countrycode": "+966" },
  { "name": "Senegal", "region": "Africa", "iso": "SN", "countrycode": "+221" },
  { "name": "Serbia", "region": "Europe", "iso": "RS", "countrycode": "+381" },
  { "name": "Seychelles", "region": "Africa", "iso": "SC", "countrycode": "+248" },
  { "name": "Sierra Leone", "region": "Africa", "iso": "SL", "countrycode": "+232" },
  { "name": "Singapore", "region": "Asia", "iso": "SG", "countrycode": "+65" },
  { "name": "Slovakia", "region": "Europe", "iso": "SK", "countrycode": "+421" },
  { "name": "Slovenia", "region": "Europe", "iso": "SI", "countrycode": "+386" },
  { "name": "Solomon Islands", "region": "Oceania", "iso": "SB", "countrycode": "+677" },
  { "name": "Somalia", "region": "Africa", "iso": "SO", "countrycode": "+252" },
  { "name": "South Africa", "region": "Africa", "iso": "ZA", "countrycode": "+27" },
  { "name": "South Sudan", "region": "Africa", "iso": "SS", "countrycode": "+211" },
  { "name": "Spain", "region": "Europe", "iso": "ES", "countrycode": "+34" },
  { "name": "Sri Lanka", "region": "Asia", "iso": "LK", "countrycode": "+94" },
  { "name": "Sudan", "region": "Africa", "iso": "SD", "countrycode": "+249" },
  { "name": "Suriname", "region": "South America", "iso": "SR", "countrycode": "+597" },
  { "name": "Sweden", "region": "Europe", "iso": "SE", "countrycode": "+46" },
  { "name": "Switzerland", "region": "Europe", "iso": "CH", "countrycode": "+41" },
  { "name": "Syrian Arab Republic", "region": "Middle East", "iso": "SY", "countrycode": "+963" },
  { "name": "Taiwan", "region": "Asia", "iso": "TW", "countrycode": "+886" },
  { "name": "Tajikistan", "region": "Asia", "iso": "TJ", "countrycode": "+992" },
  { "name": "Tanzania", "region": "Africa", "iso": "TZ", "countrycode": "+255" },
  { "name": "Thailand", "region": "Asia", "iso": "TH", "countrycode": "+66" },
  { "name": "Togo", "region": "Africa", "iso": "TG", "countrycode": "+228" },
  { "name": "Tonga", "region": "Oceania", "iso": "TO", "countrycode": "+676" },
  { "name": "Trinidad and Tobago", "region": "North America", "iso": "TT", "countrycode": "+1-868" },
  { "name": "Tunisia", "region": "Africa", "iso": "TN", "countrycode": "+216" },
  { "name": "Turkey", "region": "Middle East/Europe", "iso": "TR", "countrycode": "+90" },
  { "name": "Turkmenistan", "region": "Asia", "iso": "TM", "countrycode": "+993" },
  { "name": "Tuvalu", "region": "Oceania", "iso": "TV", "countrycode": "+688" },
  { "name": "Uganda", "region": "Africa", "iso": "UG", "countrycode": "+256" },
  { "name": "Ukraine", "region": "Europe", "iso": "UA", "countrycode": "+380" },
  { "name": "United Arab Emirates", "region": "Middle East", "iso": "AE", "countrycode": "+971" },
  { "name": "United Kingdom", "region": "Europe", "iso": "GB", "countrycode": "+44" },
  { "name": "United States", "region": "North America", "iso": "US", "countrycode": "+1" },
  { "name": "Uruguay", "region": "South America", "iso": "UY", "countrycode": "+598" },
  { "name": "Uzbekistan", "region": "Asia", "iso": "UZ", "countrycode": "+998" },
  { "name": "Vanuatu", "region": "Oceania", "iso": "VU", "countrycode": "+678" },
  { "name": "Vatican City", "region": "Europe", "iso": "VA", "countrycode": "+379" },
  { "name": "Venezuela", "region": "South America", "iso": "VE", "countrycode": "+58" },
  { "name": "Vietnam", "region": "Asia", "iso": "VN", "countrycode": "+84" },
  { "name": "Western Sahara", "region": "Africa", "iso": "EH", "countrycode": "+212" },
  { "name": "Yemen", "region": "Middle East", "iso": "YE", "countrycode": "+967" },
  { "name": "Zambia", "region": "Africa", "iso": "ZM", "countrycode": "+260" },
  { "name": "Zimbabwe", "region": "Africa", "iso": "ZW", "countrycode": "+263" }
];

 imagePath:any=''; 
  @ViewChild(IonContent, { static: false }) content?: IonContent;
  constructor(private zone: NgZone, private fileTransfer: FileTransfer,private camera: Camera,private keyboard: Keyboard, private popoverController: PopoverController, private service: ServicesService, private loadingScreen: LoadingScreenAppPage, private navController: NavController, private modalCtrl: ModalController, private translate: TranslateService) { } // Inject TranslateService
  extractedInfo: any = [];
  lang:any;
  isDeletedImg:any= false;


  ngOnInit() {
  
    // Show the accessory bar with the "Done" button
    this.keyboard.hideFormAccessoryBar(false);
    
    // Listen for the keyboard's 'done' button event
    /*this.keyboard.onKeyboardHide().subscribe(() => {
      this.onDoneButton();
    }); */
    //this.countryCodeObj.flag = "GH";
    //this.countryCodeObj.code = "+233";
    console.log(window.localStorage.getItem('coop_phone_code'))
    if(window.localStorage.getItem('coop_phone_code') != null)
    {
      this.countryCodeObj.code = window.localStorage.getItem('coop_phone_code');
      this.countryCodeObj.flag  = this.getCountryISO(this.countryCodeObj.code);
     console.log('Country ISO:', this.countryCodeObj.iso);
      
    }else
    {
      this.countryCodeObj.flag = "gb";
      this.countryCodeObj.code = "+44";
      
    }
    this.tempDetails = window.localStorage.getItem('coop_userDetails');
    this.tempDetails = JSON.parse(this.tempDetails);
    this.token = window.localStorage.getItem("coop_auth_token");
    this.profileObj.first_name = this.tempDetails.first_name;
    this.profileObj.profile_image = this.tempDetails.profile_image;
    this.profileObj.country_name = this.tempDetails.country_name;
    if (this.profileObj.profile_image && this.profileObj.profile_image.includes("user-theme.png")) {
      this.isDeletedImg = true;
    }else
    {
      this.isDeletedImg = false;
    }

// Set default language if not found in local storage
this.lang = window.localStorage.getItem("coop_language") || 'en';

// Check if tempDetails and first_name are defined
if (this.profileObj && typeof this.profileObj.first_name === 'string') {
  // Normalize the first_name to lowercase to avoid multiple checks
  if (this.profileObj.first_name.toLowerCase() == 'guest') {
    // Assign first_name based on selected language
    switch (this.lang) {
      case 'fr':
        this.profileObj.first_name = 'Invité';
        break;
          default:
        this.profileObj.first_name = 'Guest';
        break;
    }
  }
}
    this.profileObj.last_name = this.tempDetails.last_name;
    this.profileObj.email = this.tempDetails.email;
    this.profileObj.date_of_birth = this.tempDetails.date_of_birth == null ? '' : this.formatDate(this.tempDetails.date_of_birth);
    this.profileObj.mobile_number = this.tempDetails.mobile_number == null ? '' : this.tempDetails.mobile_number;

    console.log(this.profileObj.mobile_number);
    if (this.profileObj.mobile_number != '') {
      this.extractedInfo = this.extractMobileNumber(this.profileObj.mobile_number);

      if (this.extractedInfo == null) {
        this.temp_mobile_number = this.profileObj.mobile_number;
      } else {
        this.countryCodeObj.code = this.extractedInfo.countryCode;
        window.localStorage.setItem('coop_phone_code',  this.countryCodeObj.code);
        this.countryCodeObj.flag = this.extractedInfo.iso;
        this.temp_mobile_number = this.extractedInfo.number;
      }

    }
    // Listen for keyboard events
    this.keyboard.onKeyboardWillShow().subscribe(() => {
      this.adjustScroll(true);
    });

    this.keyboard.onKeyboardWillHide().subscribe(() => {
      this.adjustScroll(false);
    });
  }

  getCountryISO(phoneCode:any){
    
    if (!phoneCode) {
      return null; // Return null if no phone code is found
    }
  
    const country = this.countryList.find(
      (item: any) => item.countrycode === phoneCode
    );
  
    return country ? country.iso : null; // Return ISO if found, else null
  }

  // Method to extract country code, ISO code, and mobile number
  extractMobileNumber(mobileNumber: string): { countryCode: string, iso: string, number: string } | null {
    for (let country of this.countryList) {
      if (mobileNumber.startsWith(country.countrycode)) {
        // Remove the country code from the mobile number
        const number = mobileNumber.replace(country.countrycode, '');
        return {
          countryCode: country.countrycode,
          iso: country.iso,
          number: number
        };
      }
    }
    // If no matching country code is found
    return null;
  }

  async chooseCountry() {
    const modal = await this.modalCtrl.create({
      component: CountryCodeModelPage,
      // componentProps: { value: this.creditCardObj.billing_country }
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data.data != '') {
        this.countryCodeObj.code = result.data.data.countrycode;
        this.countryCodeObj.flag = result.data.data.iso;
      }

    });

    return await modal.present();
  }

  private adjustScroll(shouldScroll: boolean) {
    setTimeout(() => {
      if (shouldScroll) {
        this.content?.scrollToPoint(0, 200, 200);
      } else {
        this.content?.scrollToTop(200);
      }
    }, 300);
  }

  onSearch(event: any) {
    this.adjustScroll(true);
      // Get the input element
      const inputElement = event.target as HTMLInputElement;
      
      // Use regex to remove any non-digit characters
      const inputValue = inputElement.value;
      const digitsOnly = inputValue.replace(/\D/g, ''); // \D matches any non-digit character
    
      // Update the input field and the ngModel value
      inputElement.value = digitsOnly;
      this.temp_mobile_number = digitsOnly;
  }


  popover: HTMLIonPopoverElement | null = null;

  /*async presentPopover(ev: any) {
    const modal = await this.modalCtrl.create({
      component: DatePickerPage,
      componentProps: {
        value: this.profileObj.date_of_birth
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.profileObj.date_of_birth = moment(data.data).format('DD-MM-YYYY');
      }
    });
    return await modal.present();
  } */

  formatDate(date: string): string {
    let parts = date.split('-');
    let correctedDateString = `${parts[0]}-${parts[2]}-${parts[1]}`;
    let formattedDate = moment(correctedDateString).format('DD-MM-YYYY');
    return formattedDate;
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
        this.profileObj.first_name = event.target.value;
      } else {
        this.profileObj.last_name = event.target.value;
      }
    }
  }

  /*onDoneButton() {
    // Handle the 'Done' button click event
    // Close the keyboard programmatically
    this.keyboard.hide();
    this.submit();
} */
  temp_mobile_number: any = '';
delImgObj:any ={'file_name' : ''};
tempData:any=[]; 

  async delPhoto()
  {
    this.delImgObj.file_name = this.profileObj.profile_image;
    await this.loadingScreen.presentLoading();
    try {
      const res: any = await this.service.delPhoto(this.delImgObj, this.token);
      console.log("API Response:", res);  // Debugging API response
      
      this.loadingScreen.dismissLoading();
    
      if (res && res.code === 200 && res.data?.length > 0 && res.data[0]?.data) {  
        // Save to local storage correctly
        window.localStorage.setItem('coop_userDetails', JSON.stringify(res.data[0]['data']));
        this.tempData = JSON.parse(localStorage.getItem('coop_userDetails') || '{}');

        this.profileObj.profile_image = this.tempData.profile_image;
    
        // Ensure `profile_image` exists before checking `includes`
        this.isDeletedImg = this.profileObj.profile_image?.includes("user-theme.png") ?? false;
    
        this.successMSGModal(
          this.translate.instant('profile_image_deleted_success'),
          this.translate.instant('profile_image_deleted'),
          "2000"
        );
      } else {
        this.errorMSGModal(this.translate.instant('TRY_AGAIN'), this.translate.instant('Deletion Failed'));
      }
    } catch (err) {
      console.error("Error occurred in try block:", err);
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('TRY_AGAIN'), this.translate.instant('SOMETHING_WENT_WRONG'));
    }
    
  }


  async submit() {
    if (this.validate()) {
      await this.loadingScreen.presentLoading();

      if (this.isSavedDetails == true)
        window.localStorage.setItem('coop_isSavedDetails', this.profileObj.first_name);
      else
        window.localStorage.setItem('coop_isSavedDetails', '');
      this.profileObj.mobile_number = this.countryCodeObj.code + this.temp_mobile_number;
      this.service.updateProfile(this.profileObj, this.token).then((res: any) => {
        this.loadingScreen.dismissLoading();
        if (res.code == 200) {
          console.log(JSON.stringify(res.data[0]['data']));
          window.localStorage.setItem('coop_userDetails', JSON.stringify(res.data[0]['data']));
          window.localStorage.setItem('coop_auth_token', res.data[0]['token']);
          window.localStorage.setItem('coop_loginType', "normal");
          window.localStorage.setItem('coop_emailSettings', res.data[0]['promotion_email']);
          window.localStorage.setItem('coop_promoSettings', res.data[0]['app_promotions']);
          window.localStorage.setItem('coop_paymentSettings', res.data[0]['app_payment']);
          window.localStorage.setItem('coop_serviceSettings', res.data[0]['app_service']);
          this.successMSGModal(
            this.translate.instant('PROFILE_UPDATED_SUCCESSFULLY'),
            this.translate.instant('PROFILE_UPDATE'),
            "2000"
          );
          this.navController.pop();
        } else {
          this.errorMSGModal(this.translate.instant('TRY_AGAIN'), res.message);
        }
      }).catch(err => {
        this.loadingScreen.dismissLoading();
        this.errorMSGModal(this.translate.instant('TRY_AGAIN'), this.translate.instant('SOMETHING_WENT_WRONG'));
      });
    }
  }

  async errorMSGModal(buttonText: any, msg: any) {
    const modal = await this.modalCtrl.create({
      component: PasswordErrorPage,
      componentProps: { 'value': msg, 'value1': buttonText }
    });
    modal.onDidDismiss();
    return await modal.present();
  }

  async successMSGModal(buttonText: any, msg: any, times: any) {
    const modal = await this.modalCtrl.create({
      component: SuccessModelPage,
      componentProps: { 'value': msg, 'value1': buttonText, 'value2': times }
    });
    modal.onDidDismiss();
    return await modal.present();
  }

  validate() {
    let emailValid = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (this.profileObj.first_name == '' || this.profileObj.first_name == null) {
      this.errorMSGModal(this.translate.instant('OK'), this.translate.instant('PLEASE_ENTER_FIRST_NAME'));
      return false;
    }

    if (this.profileObj.last_name == '' || this.profileObj.last_name == null) {
      this.errorMSGModal(this.translate.instant('OK'), this.translate.instant('PLEASE_ENTER_SURNAME'));
      return false;
    }
   
    if (this.profileObj.email.trim() == '') {
      this.errorMSGModal(this.translate.instant('OK'), this.translate.instant('PLEASE_ENTER_EMAIL'));
      return false;
    }
    if (!emailValid.test(this.profileObj.email) && (this.profileObj.email != '')) {
      this.errorMSGModal(this.translate.instant('OK'), this.translate.instant('PLEASE_ENTER_VALID_EMAIL'));
      return false;
    }
    /*if (this.profileObj.date_of_birth == '') {
      this.errorMSGModal(this.translate.instant('OK'), this.translate.instant('PLEASE_ENTER_DOB'));
      return false;
    } */
    /*if (this.temp_mobile_number == '') {
      this.errorMSGModal(this.translate.instant('OK'), this.translate.instant('PLEASE_ENTER_MOBILE_NUMBER'));
      return false;
    } */
    return true;
  }

  gotoBack() {
    this.navController.pop();
  }

  gotoHomeSearch() {
    this.navController.navigateRoot('home-search');
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
  
   async gotoDeletepic() {
    const modal = await this.modalCtrl.create({
      component: ModalDeleteprofilepicPage,
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal Response:', result.data);
        if (result.data.action === 'deletePhoto') {
          console.log('Delete photos');
          this.delPhoto();
        } else if (result.data.action === 'go_back') {
          console.log('No actions required"');
        }
      }
    });
  
    return await modal.present();
  }

  async gotoUpload() {
    const modal = await this.modalCtrl.create({
      component: ModalUploadProfileImagePage,
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal Response:', result.data);
        if (result.data.action === 'choose_photo') {
          // Handle choosing a photo logic here
          console.log('User selected "Choose a photo"');
          this.photoGallary();
        } else if (result.data.action === 'take_photo') {
          // Handle taking a photo logic here
          console.log('User selected "Take a photo"');
          this.takePicture();

        }
      }
    });
  
    return await modal.present();
  }
  
  capturedImage:any;

  // Method to open gallery
  photoGallary() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL, // Use FILE_URI if you want a file path
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY // Opens the gallery
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        if (this.validateImageSize(imageData)) {
          this.correctImageOrientation(imageData, (correctedImage) => {
            this.uplodPhotosOnServer(imageData);
          });
         
        } else {
          this.errorMSGModal(
            this.translate.instant('TRY_AGAIN'),
            this.translate.instant('Update profile picture (10MB max)')
          );
        }
      },
      (err) => {
        this.errorMSGModal(this.translate.instant('TRY_AGAIN'), JSON.stringify(err));
        console.log('Camera Error: ', err);
      }
    );
  }

  
  // Correct image orientation
  correctImageOrientation(base64Image: string, callback: (imageUrl: string) => void) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Canvas context unavailable');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      callback(canvas.toDataURL('image/jpeg'));
    };

    img.src = base64Image;
  }

  // Method to take a picture
  takePicture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL, // or FILE_URI
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        if (this.validateImageSize(imageData)) {
          this.correctImageOrientation(imageData, (correctedImage) => {
            this.uplodPhotosOnServer(imageData);
          });
        } else {
          this.errorMSGModal(
            this.translate.instant('TRY_AGAIN'),
            this.translate.instant('Update profile picture (10MB max)')
          );
        }
      },
      (err) => {
        this.errorMSGModal(this.translate.instant('TRY_AGAIN'), JSON.stringify(err));
        console.log('Camera Error: ', err);
      }
    );
  }

  /**
   * Validates the image size.
   * @param imageData The image data returned from the camera plugin (Base64 string)
   * @returns `true` if the image size is within 10MB; otherwise, `false`.
   */
  validateImageSize(imageData: string): boolean {
    // Remove the "data:image/jpeg;base64," prefix if it exists
    let base64Data = imageData;
    if (imageData.indexOf('data:image') === 0) {
      base64Data = imageData.split(',')[1];
    }

    // Calculate the approximate file size in bytes
    const fileSizeInBytes = Math.round(base64Data.length * 3 / 4);
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes

    console.log(`Calculated file size: ${fileSizeInBytes} bytes`);
    return fileSizeInBytes <= maxFileSize;
  }

  tempImg:any=[]; 
  // Upload image on Server 
  async uplodPhotosOnServer(img: any) {
    // Present a loading screen
    await this.loadingScreen.presentLoading();

    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const options: FileUploadOptions = {
      fileKey: 'image',
      fileName: 'imageName.jpg',
      chunkedMode: false,
      mimeType: 'image/jpeg',
      headers: {
        'whitelabel': this.service.whiteLabelId,
        'client-token': this.service.clientToken,
        'Authorization': 'Bearer '+ this.token // Use your actual token here
      }
    };

    fileTransfer.upload(img, this.service.restAPI + 'upload/profile/image', options).then(
      (data: any) => {
      
       // alert("Success => " + JSON.stringify(data));
        this.tempImg = JSON.parse(data.response);
        if (this.tempImg.code == 200) {  

          // Save updated user details to local storage correctly
          this.loadingScreen.dismissLoading();
          window.localStorage.setItem('coop_userDetails', JSON.stringify(this.tempImg.data[0].data));

          // Retrieve and update profile image
          this.tempData = JSON.parse(localStorage.getItem('coop_userDetails') || '{}');
          //alert("Profiles" + JSON.stringify(this.tempData));
          //alert("profile_image" + JSON.stringify(this.tempImg.data[0].profile_image));
          // Assign the updated profile image URL from the response
          this.profileObj.profile_image = this.tempImg.data[0].profile_image;

          // Show success message
          this.successMSGModal(
            this.translate.instant('profile_image_uploaded'),
            this.translate.instant('profile_image'),
            "2000"
          );
        } else {
          this.loadingScreen.dismissLoading();
          this.errorMSGModal(
            this.translate.instant('TRY_AGAIN'),
            this.translate.instant('unable_to_upload_image')
          );
        }

      //  alert("Upload Success "+ JSON.stringify(data));
      /*  this.tempImg = JSON.parse(data.response);
        if (this.tempImg.success === true) {
          // Dismiss loading, update profile image, and show success message
          this.loadingScreen.dismissLoading();
          this.zone.run(() => {
          this.profileObj.profile_image = this.tempImg.file_name;
        });
          this.successMSGModal(
            this.translate.instant('profile_image_uploaded'),
            this.translate.instant('profile_image'),
            "2000"
          );
        } else {
          this.loadingScreen.dismissLoading();
          this.errorMSGModal(
            this.translate.instant('TRY_AGAIN'),
            this.translate.instant('unable_to_upload_image')
          );
        } */
      },
      (err) => {
       // alert("Error=>"+ JSON.stringify(err));
        this.loadingScreen.dismissLoading();
        this.errorMSGModal(
          this.translate.instant('TRY_AGAIN'),
          this.translate.instant('SOMETHING_WENT_WRONG')
        );
        console.log('Upload Error: ', err);
      }
    );
  }

 

}
