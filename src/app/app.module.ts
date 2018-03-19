import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';


import {AppComponent} from './app.component';
import {RowComponent} from './row/row.component';
import {CardComponent} from './row/card/card.component';
import {BaseButtonComponent} from './baseButton/button.component';
import {StartButtonComponent} from './startButton/startButton.component';

import {TheSetService} from './services/theSet.service';


@NgModule({
  declarations: [
    AppComponent,
    RowComponent,
    CardComponent,
    BaseButtonComponent,
    StartButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    TheSetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
