import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from "@ionic/angular";

@Component({
  selector: 'app-modal-couponadded',
  templateUrl: './modal-couponadded.page.html',
  styleUrls: ['./modal-couponadded.page.scss'],
})

export class ModalCouponaddedPage implements OnInit {
  @Input("value") value: any;
  @Input("value1") value1: any;

  currencyCode: any = 'GBP';


  constructor(private modalCtrl: ModalController) { }

  gotoClose() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    if (window.localStorage.getItem("coop_currency") == null) {
      this.currencyCode = 'GBP';
    } else {
      this.currencyCode = window.localStorage.getItem("coop_currency");
    }
  }


}
