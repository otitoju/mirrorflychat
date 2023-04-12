import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CallComponentComponent } from './call-component.component';

@NgModule({
  declarations: [
    CallComponentComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    CallComponentComponent
  ]
})
export class SharedModule { }
