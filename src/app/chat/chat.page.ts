// import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { IonContent, ScrollDetail, LoadingController } from '@ionic/angular';
// import { DatePipe } from '@angular/common';
// import { interval, Subscription } from 'rxjs';
// import { ActivatedRoute } from '@angular/router';

// declare var SDK: any;

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.page.html',
//   styleUrls: ['./chat.page.scss'],
// })
// export class ChatPage implements OnInit, OnDestroy {
//   USR_IDENTIFIER = {
//     username: '',
//     password: '',
//   };
//   chatMsg: any;
//   loggedInUser: any = '';
//   openedUserChat:any
//   Chats: any = [];
//   showToolbar = false;

//   @ViewChild('content')
//   content!: IonContent;
//   intervalSubscription: Subscription = new Subscription();

//   constructor(private loadingCtrl: LoadingController, private route: ActivatedRoute) {}

//   ngOnInit() {
//     this.GetMessages()
//     const Id = this.route.snapshot.paramMap.get('id');
//     this.openedUserChat = Id;
//   }

//   async ngAfterViewInit() {
//     setTimeout(() => {
//       let Local_Msg:any = localStorage.getItem("Messages");
//       this.Chats = JSON.parse(Local_Msg)
//     }, 3000)
//   }

//   async GetMessages() {
//     try {
//       let user: any = localStorage.getItem('Email');

//       this.loggedInUser = JSON.parse(user).toLowerCase();
//       let init: any = await this.InitializeApp();
//       const loading = await this.loadingCtrl.create({
//         message: 'Loading messages...',
//       });

//       //loading.present();
//       if (init.statusCode === 200) {
//         let reg = await this.RegisterUser();
//         if (reg.statusCode === 200) {
//           this.GetAllMessages();
//           let login = await this.LoginUser();
//           this.intervalSubscription = interval(2000).subscribe(() => {
//             this.GetAllMessages();
//           });
//           if (login.statusCode === 200) {
//             this.GetAllMessages();
//             //await SDK.getUsersList();
//             //loading.dismiss();

//             //let users = await SDK.getRegisteredUsers();
//             let users = await SDK.getUsersList();

//             console.log(users);
//           }
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   ngOnDestroy() {
//     this.intervalSubscription.unsubscribe();
//   }

//   async GetAllMessages() {
//     let chat = await this.getRecentChats();
//     let sortedChat: any[] = chat.data;
//     sortedChat.sort((a, b) => a.timestamp - b.timestamp);
//     localStorage.setItem("Messages", JSON.stringify(chat))
//     //this.Chats = chat;
//     //this.content.scrollToBottom();
//   }

//   onScroll($event: CustomEvent<ScrollDetail>) {
//     if ($event && $event.detail && $event.detail.scrollTop) {
//       const scrollTop = $event.detail.scrollTop;
//       this.showToolbar = scrollTop >= 40;
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
//     if (response.msgType === 'seen') {
//       this.GetAllMessages();
//     } else {
//       this.GetAllMessages();
//       this.chatMsg = '';
//     }
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

//   async sendMessage() {
//     let user: any = localStorage.getItem('MsgId');

//     let toUserJid = SDK.getJid(JSON.parse(user));

//     let textMsg = await SDK.sendTextMessage(toUserJid.userJid, this.chatMsg);
//     console.log(textMsg);
//     this.GetAllMessages();
//     this.chatMsg = '';
//   }

//   async getRecentChats() {
//     let user: any = localStorage.getItem('MsgId');
//     let toUserJid = await SDK.getJid(JSON.parse(user));
//     console.log(toUserJid);

//     let chats = await SDK.getChatMessages(toUserJid.userJid);

//     console.log(chats);
//     return chats;
//   }

//   GetDateFormat(date: any): any {
//     //console.log(date);

//     let culture = 'en-US'; // from a service or local st
//     let pipe = new DatePipe('en-US');

//     switch (culture) {
//       case 'de-AT':
//       case 'fr-FR':
//       case 'es-ES':
//         return pipe.transform(date, 'dd-MM-yyyy HH:mm');

//       case 'en-US':
//         return pipe.transform(date, 'MM/dd/yyyy HH:mm');

//       case 'en-UK':
//         return pipe.transform(date, 'MM-dd-yyyy HH:mm');
//     }
//   }
// }


import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, ScrollDetail, LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../services/util.service';
import { ChatHandler } from '../services/chathandler.service';

declare var SDK: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  USR_IDENTIFIER = {
    username: '',
    password: '',
  };
  chatMsg: any;
  loggedInUser: any = '';
  openedUserChat:any
  Chats: any = [];
  showToolbar = false;
  lastSeen = '';
  typingStatus:any = '';
  @ViewChild('content')
  content!: IonContent;
  intervalSubscription: Subscription = new Subscription();

  constructor(private loadingCtrl: LoadingController,
     private route: ActivatedRoute,
     private utilService: UtilService,
     public chatHandler: ChatHandler
     ) {}

  ngOnInit() {
    // const Id = this.route.snapshot.paramMap.get('id');
    // this.openedUserChat = Id?.toLowerCase()
    let logUser:any = localStorage.getItem("MsgId");
    this.loggedInUser = JSON.parse(logUser).toLowerCase();

  }

  async ngAfterViewInit() {
    this.GetChats();
    //return
    this.intervalSubscription = interval(5000).subscribe(() => {
      this.utilService.GetAllMessages().then((res) => {
        //console.log(res.data);
        this.Chats = res.data
      })
    });



  }

  async GetChats() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait..',
    });

    loading.present();
    this.utilService.GetAllMessages().then((res) => {
     // console.log(res.data);
      loading.dismiss();
      this.Chats = res.data;
      this.content.scrollToBottom();
      let logUser:any = localStorage.getItem("MsgId");
      this.utilService.GetLastSeen(logUser).then(res => {
        this.lastSeen = res;
      })

      this.utilService.sendSeenStatus().then(res => {
        console.log(res);

      })
    })
  }



  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
  }



  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 40;
    }
  }


  async sendMessage() {
    this.utilService.sendMessage(this.chatMsg).then((res) => {

      //console.log(res);
      this.utilService.LoadSentMessages().then((res) => {
        this.Chats = res.data;
        this.content.scrollToBottom();
        this.chatMsg = '';
      })
    })
    return
    let user: any = localStorage.getItem('MsgId');

    let toUserJid = SDK.getJid(JSON.parse(user));

    let textMsg = await SDK.sendTextMessage(toUserJid.userJid, this.chatMsg);
    console.log(textMsg);
    this.chatMsg = '';
  }



  GetDateFormat(date: any): any {
    //console.log(date);

    let culture = 'en-US'; // from a service or local st//
    let pipe = new DatePipe('en-US');

    switch (culture) {
      case 'de-AT':
      case 'fr-FR':
      case 'es-ES':
        return pipe.transform(date, 'dd-MM-yyyy HH:mm');

      case 'en-US':
        return pipe.transform(date, 'MM/dd/yyyy HH:mm');

      case 'en-UK':
        return pipe.transform(date, 'MM-dd-yyyy HH:mm');
    }
  }

  GetUserProfile() {
    let user: any = localStorage.getItem('MsgId');
    this.utilService.userProfile(JSON.parse(user)).then((res) => {
      console.log(res)
    })
  }

  async handleMessageChange(e:any) {
    console.log(e.length);
    if(e.length > 0) {
       return await this.utilService.sendTypingStatusToReceiver().then(res => {
        console.log(res);
        if(res.statusCode === 200) {
          console.log("Still typing")
        }
        else {
          if(e.length === 0){

            console.log("Done typing...");
          }

        }

      })
      console.log(UtilService.typingStatus);

    }

    if(e.length === 0){

      console.log("Done typing...");
    }
    // else {
    //   this.chatHandler.ChatTypingStatus = ''
    //   //this.typingStatus = ''
    // }

  }

  async selectImage() {
    // const imagePickerOptions: ImagePickerOptions = {
    //   maximumImagesCount: 1
    // };

    try {
      // const results = await this.imagePicker.getPictures(imagePickerOptions);

      // if (results.length > 0) {
      //   const imageData = await this.file.readAsArrayBuffer(results[0]);

      //   // Call the sendImageMessage function, passing in the imageData
      //   this.sendImageMessage(imageData);
      // }
    } catch (error) {
      console.error('Error selecting image', error);
    }
  }

  handleFileInput(e:any) {
    let file = e.target.files[0];
    //const imageFile = files.item(0);
    console.log(file);

    this.utilService.sendImageMessage(file);
  }

  handleVideoCall() {
    this.utilService.makeVideoCall().then(res => {
      console.log(res)
    })
  }

  async handleVoiceCall() {
    await this.utilService.makeVoiceCall().then(res => {
      console.log(res)
    })
  }


}

