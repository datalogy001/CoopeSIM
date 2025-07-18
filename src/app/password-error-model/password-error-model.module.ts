import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordErrorModelPageRoutingModule } from './password-error-model-routing.module';

import { PasswordErrorModelPage } from './password-error-model.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordErrorModelPageRoutingModule
  ],
  declarations: [PasswordErrorModelPage]
})
export class PasswordErrorModelPageModule {}
