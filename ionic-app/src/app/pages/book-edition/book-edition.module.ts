import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookEditionPageRoutingModule } from './book-edition-routing.module';

import { BookEditionPage } from './book-edition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookEditionPageRoutingModule
  ],
  declarations: [BookEditionPage]
})
export class BookEditionPageModule {}
