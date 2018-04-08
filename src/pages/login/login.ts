import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { RegisterPage } from "../register/register"
import { HomePage } from "../home/home"
import { ServerProvider } from '../../providers/server/server';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serverProvider: ServerProvider
  ){}

  loginUser(form: NgForm){
    let user = {
      username: form.value.username,
      password: form.value.password
    }
    this.serverProvider
      .login(user).subscribe(result => {
        if(result["success"]){
          this.navCtrl.setRoot(HomePage)
        }
      }
    )
  }

  register(){
    this.navCtrl.push(RegisterPage)
  }

  ionViewDidLoad() {
    
  }

}
