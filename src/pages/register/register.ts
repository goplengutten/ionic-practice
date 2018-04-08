import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { LoginPage } from "../login/login"
import { HomePage } from "../home/home"
import { ServerProvider } from '../../providers/server/server';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private serverProvider: ServerProvider
  ){}

  registerUser(form: NgForm){
    let user = {
      username: form.value.username,
      password: form.value.password
    }
    this.serverProvider.register(user).subscribe(result => {
      if(result["success"]){
        this.navCtrl.setRoot(HomePage)
      }
    })
  }

  login(){
    this.navCtrl.push(LoginPage)
  }
  
  

  ionViewDidLoad() {
  }

}
