import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from "../login/login"
import { RegisterPage } from "../register/register"
import { GamePage } from "../game/game"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  login(){
    this.navCtrl.push(LoginPage)
  }

  register(){
    this.navCtrl.push(RegisterPage)
  }

  game(){
    this.navCtrl.push(GamePage)
  }

}
