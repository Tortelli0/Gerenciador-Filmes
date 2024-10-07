import { Component, OnInit } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt'
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  providers: [ {provide: LOCALE_ID, useValue: 'pt-BR' } ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent{

  constructor() {
    registerLocaleData(localePtBr);
  }

}
