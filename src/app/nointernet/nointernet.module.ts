import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NointernetPageRoutingModule } from './nointernet-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NointernetPage } from './nointernet.page';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    NointernetPageRoutingModule
  ],
  declarations: [NointernetPage]
})
export class NointernetPageModule {}
