// import { Component, OnInit } from '@angular/core';
// import { NavController, NavParams } from '@ionic/angular';
// import { Router } from '@angular/router';
// declare var SDK: any;

// @Component({
//   selector: 'app-chats',
//   templateUrl: './chats.page.html',
//   styleUrls: ['./chats.page.scss'],
// })
// export class ChatsPage implements OnInit {
//   friends:any[] = [];
//   USR_IDENTIFIER = {
//     username: '',
//     password: '',
//   };
//   loggedInUser: any = '';

//   constructor(private navController: NavController, private router: Router) { }

//   async ngOnInit() {
//     console.log("ngOnInit");

//     try {
//       let user: any = localStorage.getItem('Email');

//       this.loggedInUser = JSON.parse(user).toLowerCase();
//       let init: any = await this.InitializeApp();

//       if (init.statusCode === 200) {
//         let reg = await this.RegisterUser();
//         if (reg.statusCode === 200) {
//           let login = await this.LoginUser();
//           if (login.statusCode === 200) {
//             //await SDK.getUsersList();
//             //let users = await SDK.getRegisteredUsers();
//             let users = await SDK.getUsersList();
//             this.friends = users.users
//             console.log(users);
//           }
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }

//   }

//   async ngAfterViewInit() {
//     console.log("ngAfterViewInit");
//     this.GetChats();

//     setTimeout(() => {

//       let Local_Users:any = localStorage.getItem("Chats");
//       this.friends = JSON.parse(Local_Users)
//     }, 5000)
//   }

//   async GetChats() {
//     try {
//       let user: any = localStorage.getItem('Email');

//       this.loggedInUser = JSON.parse(user).toLowerCase();
//       let init: any = await this.InitializeApp();

//       if (init.statusCode === 200) {
//         let reg = await this.RegisterUser();
//         if (reg.statusCode === 200) {
//           let login = await this.LoginUser();
//           if (login.statusCode === 200) {
//             let users = await SDK.getUsersList();
//             localStorage.setItem("Chats", JSON.stringify(users.users))
//             // this.friends = users.users
//             console.log(users);
//           }
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   public connectionListener = function (response: any): any {
//     if (response.status === 'CONNECTED') {
//       console.log('Connection Established');
//     } else if (response.status === 'DISCONNECTED') {
//       console.log('Disconnected');
//     }
//   };

//   public messageListener = (response: any) => {
//     console.log("Message Listener", response.msgType);
//   };

//   public friendsListListener = async (response: any) => {
//     console.log('Friends List', response);

//   };

//   async InitializeApp() {
//     let conn = this.connectionListener;
//     const initializeObj = {
//       apiBaseUrl: `https://api-preprod-sandbox.mirrorfly.com/api/v1`,
//       licenseKey: `1vp4cgag4iGYiP66HOJpa3y9k84KPr`,
//       isTrialLicenseKey: true,
//       callbackListeners: {
//         connectionListener: conn,
//         messageListener: this.messageListener,
//         friendsListListener: this.friendsListListener,
//       },
//     };

//     let initResponse = await SDK.initializeSDK(initializeObj);
//     console.log(initResponse);
//     return initResponse;
//   }

//   async RegisterUser() {
//     let user: any = localStorage.getItem('Email');
//     //this.loggedInUser = user;
//     let userReg = await SDK.register(JSON.parse(user));
//     // console.log(userReg);
//     this.USR_IDENTIFIER.username = userReg.data.username;
//     this.USR_IDENTIFIER.password = userReg.data.password;
//     return userReg;
//   }

//   async LoginUser() {
//     let login = await SDK.connect(
//       this.USR_IDENTIFIER.username,
//       this.USR_IDENTIFIER.password
//     );
//     // console.log(login);
//     return login;
//   }

//   OpenChat(id:any) {
//     localStorage.setItem("MsgId", JSON.stringify(id));
//     this.router.navigate(['/chat']);

//     //this.router.navigate(['/chat'], { queryParams: { param1: id } });
//   }


// }



import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilService } from '../services/util.service';
import { LoadingController } from '@ionic/angular';
declare var SDK: any;

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],

})
export class ChatsPage implements OnInit {
  friends:any[] = [];
  USR_IDENTIFIER = {
    username: '',
    password: '',
  };
  loggedInUser: any = '';

  constructor(private router: Router,
    private utilService: UtilService,
    private loading: LoadingController) { }

  async ngOnInit() {
    console.log("INIT")
  }

  async ngAfterViewInit() {

    this.GetFriends();
  }

  ionViewDidEnter() {
    this.utilService.GetFriendsWhoWeChat().then((res:any[]) => {
      res.sort((a, b) => b.timestamp - a.timestamp)
      this.friends = res;
     })
  }

  async GetFriends() {
    const loading = await this.loading.create({
      message: 'Loading chats..',
    });

    loading.present();
    this.utilService.GetFriendsWhoWeChat().then((res:any[]) => {
      //console.log(res);
      loading.dismiss()
      res.sort((a, b) => b.timestamp - a.timestamp)
      this.friends = res;
     })
  }

  OpenChat(id:any) {
    localStorage.setItem("MsgId", JSON.stringify(id));
    this.router.navigate(['/chat']);

    //this.router.navigate(['/chat'], { queryParams: { param1: id } });
  }

  UpdateUserProfile () {
    this.utilService.UpdateUserProfile("Maxwell",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThye7oEv-5iseoJ1f5VaW-aIczCLBiFsHdooySGmQ&s",
    "I'm new here", "09055932268", "test@gmail.com"
    );
  }

  GetProfile() {
    let user: any = localStorage.getItem('Email');
    this.utilService.userProfile(JSON.parse(user)).then(res => {
      console.log(res)
    })
  }




}
