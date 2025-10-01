import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Platform, NavController, ToastController, PopoverController, ModalController, LoadingController } from "@ionic/angular";
import { Router, NavigationExtras } from '@angular/router';
import { ServicesService } from '../api/services.service';
import { LoadingScreenAppPage } from '../loading-screen-app/loading-screen-app.page';
import { PasswordErrorPage } from '../password-error/password-error.page';
import { PasswordErrorModelPage } from '../password-error-model/password-error-model.page';
import { SuccessModelPage } from '../success-model/success-model.page';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { CountryCodeModelPage } from '../country-code-model/country-code-model.page';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-socail-login-country-phone',
  templateUrl: './socail-login-country-phone.page.html',
  styleUrls: ['./socail-login-country-phone.page.scss'],
})
export class SocailLoginCountryPhonePage implements OnInit {
  @ViewChild('searchDiv', { static: true }) searchDiv!: ElementRef;

  paramObj: any = { 'mobile_number': '', 'country_name': '', 'user_id': '', 'is_complete_signup': 1, "city" :'' }
  token: any;
  temp_mobile_number: any = '';
  isearchIMg: any;
  searchTerm: string = '';
  searchData: any = [];
  searchIMg: any;
  isSearch: any = false;
  countryCodeObj: any = {
    flag: '',
    code: ''
  };
  iso: any;
  isCountrySelected: any = false;
  tempCountry: any = [
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
  countryListWithCodes: any = [
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

  phoneError: string = '';
countryError: string = '';

  // Inject services and controllers
  constructor(private translate: TranslateService,
    private loadingScreen: LoadingScreenAppPage,
    private platform: Platform,
    private loadCtr: LoadingController,
    private service: ServicesService,
    public popoverController: PopoverController,
    private Router: Router,
    private navController: NavController,
    private toastController: ToastController,
    private modalController: ModalController,
  ) { }

showPhoneError(msg: string) {
  this.phoneError = msg;
  setTimeout(() => {
    this.phoneError = '';
  }, 3000);
}

showCountryError(msg: string) {
  this.countryError = msg;
  setTimeout(() => {
    this.countryError = '';
  }, 3000);
}

  onClearSearch() {
    this.isSearch = false;
    this.searchTerm = '';
    this.iso = '';
    this.isearchIMg = '';
    this.searchData = this.tempCountry;
    this.isCountrySelected = false;
    this.paramObj.country_name='';
    this.searchDiv.nativeElement.classList.remove('searching');
    this.countryCodeObj = {};
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
  gotoSelect(countryRES: any) {
    this.isSearch = false;
    this.isearchIMg = countryRES.iso;
    this.searchTerm = countryRES.name;
    this.searchDiv.nativeElement.classList.add('searching');
    this.isCountrySelected = true;
    this.paramObj.country_name = countryRES.name;
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
      this.isCountrySelected = false;
      this.searchDiv.nativeElement.classList.remove('searching');
    }
  }

  langDefault: any;
  tempDetails:any=[]; 
  ngOnInit() {
    this.langDefault = window.localStorage.getItem('coop_language');
    this.tempDetails = window.localStorage.getItem('coop_userDetails');
    this.paramObj.city = window.localStorage.getItem('coop_city') || '' ;
    //this.countryCodeObj.code = window.localStorage.getItem('coop_phone_code') || '+44';
    //this.countryCodeObj.flag = window.localStorage.getItem('coop_country_code') || 'gb';
    this.tempDetails = JSON.parse(this.tempDetails);
    this.paramObj.user_id = this.tempDetails.id;
    this.token = window.localStorage.getItem("coop_auth_token");
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
  }

 async submit(): Promise<void> {
  if (!this.validate()) {
    return;
  }

  try {
    this.paramObj.mobile_number = this.countryCodeObj.code + this.temp_mobile_number;
    console.log('Submitting signup params:', this.paramObj);

    await this.loadingScreen.presentLoading();

    const res: any = await this.service.completeSignup(this.paramObj, this.token);
    this.loadingScreen.dismissLoading();
    if (res.code === 200) {
          console.log(JSON.stringify(res.data[0]['data']));
          window.localStorage.setItem('coop_userDetails', JSON.stringify(res.data[0]['data']));
         this.modalController.dismiss({ success: true });
    } else {
      this.errorMSGModal(res.message, this.translate.instant('VALIDATION_MSG_BUTTON_TRY_AGAIN'));
    }

  } catch (err: any) {
    this.loadingScreen.dismissLoading();
    const message = err?.message || JSON.stringify(err);
    this.errorMSGModal(message, this.translate.instant('VALIDATION_MSG_BUTTON_TRY_AGAIN'));
  }
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

validate() {
  const mobileValid = /^[0-9]{10,11}$/; // only digits, 10–11 length
  let valid = true;

  // Country validation
  if (!this.paramObj.country_name || this.paramObj.country_name.trim() === '') {
    this.showCountryError(this.translate.instant('VALIDATION_MSG_SELECT_COUNTRY'));
    valid = false;
  }

  // Mobile empty check
  else if (!this.temp_mobile_number || this.temp_mobile_number.trim() === '') {
    this.showPhoneError(this.translate.instant('VALIDATION_MSG_ENTER_MOBILE_NUMBER'));
    valid = false;
  }

  // Mobile format check
  else if (!mobileValid.test(this.temp_mobile_number.trim())) {
    this.showPhoneError(this.translate.instant('VALIDATION_MSG_ENTER_VALID_MOBILE_NUMBER'));
    valid = false;
  }

  return valid;
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
}
