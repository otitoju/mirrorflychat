import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = "";
  password = "";

  constructor(private router: Router, private utilService: UtilService) { }

  ngOnInit() {
  }

  handleLogin() {
    console.log(this.email, this.password);
    if(!this.email || !this.password) {
      return
    }
    else {
      localStorage.setItem("Email", JSON.stringify(this.email));
      localStorage.setItem("Password", this.password);
      //this.utilService.InitializeApp();
      this.utilService.RegisterUser().then((res) => {
        console.log("REg", res)
        if(res.statusCode === 200) {
          this.utilService.LoginUser().then((res) => {
            console.log("LOG", res)
            this.utilService.GetFriends().then((res) => {
              this.router.navigate(["/chats"])
            })
          })
        }
      })
      setTimeout(() => {

      },5000)

      return
      if(this.email === "287675fgftrreddfbnhgh5D") {
        localStorage.setItem("User", JSON.stringify("1F7675433234467kjjhghgf"));
        localStorage.setItem("Email", JSON.stringify(this.email));
        localStorage.setItem("Password", this.password);
        this.router.navigate(["/chat"])
      }
      else {
        localStorage.setItem("User", JSON.stringify("287675fgftrreddfbnhgh5D"))
        localStorage.setItem("Email", JSON.stringify(this.email));
        localStorage.setItem("Password", this.password);
        this.router.navigate(["/chat"])
      }

    }
  }



}
