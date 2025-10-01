import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
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
import { CountryCodeModelPage} from '../country-code-model/country-code-model.page';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';
 import {SocailLoginCountryPhonePage} from '../socail-login-country-phone/socail-login-country-phone.page';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  @ViewChild('searchDiv', { static: true }) searchDiv!: ElementRef;
   @ViewChild(IonContent, { static: false }) content?: IonContent;
  registerObj: any = { 'referal_code': '', 'mobile_number' : '', 'country_name' : '',  'city':'','first_name': '', 'last_name': '', 'password': '', 'email': '', 'isPrivacySelected': false, 'isTermsSelected': false, 'confirmPass': '', 'deviceToken': '' ,'lang' : ''};
  terms: any = [];
  privacy: any = [];
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-off-outline';
  isearchIMg: any;
  searchTerm: string = '';
  searchData: any = [];
  searchIMg: any;
  isSearch: any = false;
   countryCodeObj: any = {
    flag: '',
    code: ''
  };
  
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
   tempCountry : any = [
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
  countryListWithCodes : any = [
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

  //CODE STARTED FOR REGISTER
  langDefault: any;
  iso:any;

   onClearSearch() {
    this.isSearch = false;
    this.searchTerm = '';
    this.iso = '';
    this.isearchIMg = '';
    this.searchData = this.tempCountry;
    this.isCountrySelected =false;
     this.countryCodeObj = {};
    this.searchDiv.nativeElement.classList.remove('searching');
  }


 findMatchingItems(searchTerm: string): any[] {
  // normalize input (lowercase + remove spaces)
  const normalizedSearch = searchTerm.toLowerCase().replace(/\s+/g, "");

  const matchingItems = this.countryListWithCodes.filter((item: any) => {
    const normalizedName = item.name.toLowerCase().replace(/\s+/g, "");
    return normalizedName.startsWith(normalizedSearch);
  });

  // Ensure uniqueness by country name
  const uniqueItemsMap = new Map<string, any>();
  matchingItems.forEach((item: any) => {
    uniqueItemsMap.set(item.name, item);
  });

  return Array.from(uniqueItemsMap.values());
}

  temp_mobile_number: any = '';

onSearchMobile(event: any) {
  const inputValue: string = event.target.value || '';
  this.temp_mobile_number = inputValue.replace(/\D/g, ''); // digits only
}

  onSearch(event: any) {
    const searchTerm: string = event.target.value;
    this.searchData = this.tempCountry;
  if (searchTerm) {
      this.searchData = this.findMatchingItems(searchTerm);
     this.isSearch = true;
    } else {
      this.isearchIMg = '';
      this.isSearch = false;
      this.isCountrySelected =false;
      this.searchDiv.nativeElement.classList.remove('searching');
    }
  }
  isCountrySelected:any =false;

 gotoSelect(countryRES: any) {
  this.isSearch = false;
  this.isearchIMg = countryRES.iso;
  this.searchTerm = countryRES.name;
  this.searchDiv.nativeElement.classList.add('searching');
  this.isCountrySelected = true;

  this.registerObj.country_name = countryRES.name;
  this.countryCodeObj.code = countryRES.countrycode;
  this.countryCodeObj.flag = countryRES.iso;

  console.log(JSON.stringify(countryRES));
}

    async chooseCountry() {
      const modal = await this.modalController.create({
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

  // Initialize component
  ngOnInit() {
    this.langDefault = window.localStorage.getItem('coop_language');
    this.registerObj.city = window.localStorage.getItem('coop_city') || '' ;
    //this.countryCodeObj.code = window.localStorage.getItem('coop_phone_code') || '+44';
    //this.countryCodeObj.flag = window.localStorage.getItem('coop_country_code') || 'gb';

    this.translate.use(this.langDefault).subscribe(() => {
      this.searchData = this.searchData.map((country: any) => ({
        name: this.translate.instant(`COUNTRIES.${country.iso}`),
        region: country.region,
        iso: country.iso,
        countrycode: country.countrycode
      }));

         this.tempCountry = this.tempCountry.map((country: any) => ({
        name: this.translate.instant(`COUNTRIES.${country.iso}`),
        region: country.region,
        iso: country.iso,
        countrycode: country.countrycode
      }));
    });

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
    //this.searchDiv.nativeElement.classList.remove('searching');
    //this.searchTerm = '';
    //this.isearchIMg = '';
    //this.iso = '';
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
      
     //Already registered  
     if(resNew.data['is_register'] == false)
     {
      this.successMSGModal(this.translate.instant('SUCCESS_MSG_BUTTON'), this.translate.instant('SUCCESS_MSG_TEXT'), "4000");
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
     //First time -SIGNUP- Google 
      //Socail Media Country Model STARTED 
     this.modelSocailCountry( resNew.data['id'],this.Router.url );
     }

    } else {
      this.errorMSGModal(this.translate.instant('ERROR_MSG_BUTTON'), this.translate.instant('ERROR_MSG_TEXT'));
    }
  })
}

async modelSocailCountry(userId: string, routeURL: string): Promise<void> {
  const modal = await this.modalController.create({
    component: SocailLoginCountryPhonePage, // fixed typo
  });

  modal.onDidDismiss().then((result) => {
    console.log('Modal result:', result);

    if (result.data.success == true) {
      this.checkoutObj.id = userId;
      this.successMSGModal(this.translate.instant('SUCCESS_MSG_BUTTON'), this.translate.instant('SUCCESS_MSG_TEXT_Wl'), "2000");
      const navigationExtras: NavigationExtras = {
        state: {
          checkoutData: this.checkoutObj,
          withOutLogin: this.isLogin,
          payBack: routeURL,
        },
      };

      this.Router.navigate(['signup-socialrefer'], navigationExtras);
    }
  });

  await modal.present();
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
      this.registerObj.mobile_number = this.countryCodeObj.code + this.temp_mobile_number;

      console.log(JSON.stringify(this.registerObj));
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
  let mobileValid = /^[0-9]{10,11}$/; // 10 to 11 digits only

   if (this.registerObj.first_name.trim() == '') {
  this.loadingScreen.dismissLoading();
  this.errorMSGModal(
    this.translate.instant('VALIDATION_MSG_ENTER_FIRST_NAME'),
    this.translate.instant('VALIDATION_MSG_BUTTON_OK')
  );
  return false;
} else if (this.registerObj.first_name.trim().length < 3) {
  this.loadingScreen.dismissLoading();
  this.errorMSGModal(
    this.translate.instant('VALIDATION_MSG_FIRST_NAME_MIN_LENGTH'), // add this key in translations
    this.translate.instant('VALIDATION_MSG_BUTTON_OK')
  );
  return false;
} else if (this.registerObj.last_name.trim() == '') {
  this.loadingScreen.dismissLoading();
  this.errorMSGModal(
    this.translate.instant('VALIDATION_MSG_ENTER_SURNAME'),
    this.translate.instant('VALIDATION_MSG_BUTTON_OK')
  );
  return false;
} else if (this.registerObj.last_name.trim().length < 3) {
  this.loadingScreen.dismissLoading();
  this.errorMSGModal(
    this.translate.instant('VALIDATION_MSG_SURNAME_MIN_LENGTH'), // add this key in translations
    this.translate.instant('VALIDATION_MSG_BUTTON_OK')
  );
  return false;
}
else if (this.registerObj.email.trim() == '') {
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

    }  else if (this.registerObj.country_name.trim() == '') {
      this.loadingScreen.dismissLoading();
      this.errorMSGModal(this.translate.instant('VALIDATION_MSG_SELECT_COUNTRY'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
      return false;
    }
    else if (this.temp_mobile_number.trim() == '') {
    this.loadingScreen.dismissLoading();
    this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ENTER_MOBILE_NUMBER'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
    return false;
  } else if (!mobileValid.test(this.temp_mobile_number)) {
    this.loadingScreen.dismissLoading();
    this.errorMSGModal(this.translate.instant('VALIDATION_MSG_ENTER_VALID_MOBILE_NUMBER'), this.translate.instant('VALIDATION_MSG_BUTTON_OK'));
    return false;
  }
    else if (this.registerObj.isPrivacySelected == false && this.registerObj.isTermsSelected == false) {
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
