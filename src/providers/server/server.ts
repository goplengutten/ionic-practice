import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 

@Injectable()
export class ServerProvider {

  constructor(private http: HttpClient) {

  }


  public login(credentials){
    return this.http.post("http://localhost:3000/api/login", credentials)
      .map(response => {
        console.log(response)
        return response
      })
    
  }

  public register(credentials) {
    return this.http.post("http://localhost:3000/api/register", credentials)
      .map(response => {
        console.log(response)
        return response
      })
    
  }

  public logout() {
    return this.http
      .get("http://localhost:3000/api/logout")
      .map(response => {
        return response
      })
  }
}
