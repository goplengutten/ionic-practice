import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ServerProvider } from '../../providers/server/server'
import { LoginPage } from "../login/login"
import { GamePage } from "../game/game"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public serverProvider: ServerProvider) {

  }

  logoutUser(){
    this.serverProvider.logout()
      .subscribe(
        (result) => {
          console.log(result)
          this.navCtrl.setRoot(LoginPage)
        }, 
        (err) => console.log(err)
      )
  }

  game(){
    this.navCtrl.push(GamePage)
  }

}
