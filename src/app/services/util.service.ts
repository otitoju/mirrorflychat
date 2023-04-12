import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { ChatHandler } from './chathandler.service';
import { AlertController } from '@ionic/angular';
declare var SDK: any;

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  static Chats: any[];
  static username: any;
  static password: any;
  static intervalSubscription: Subscription = new Subscription();
  static typingStatus: any;

  constructor(
    private loading: LoadingController,
    public chatHandler: ChatHandler,
  ) {
    //console.log("Initialize");
    this.InitializeApp();
  }

  async GetMessages() {
    try {
      this.GetAllMessages();
      // UtilService.intervalSubscription = interval(5000).subscribe(() => {
      //   this.GetAllMessages();
      // });
      // this.loggedInUser = JSON.parse(user).toLowerCase();
      // const loading = await this.loadingCtrl.create({
      //   message: 'Loading messages...',
      // });

      return;
      let init: any = await this.InitializeApp();

      //loading.present();
      if (init.statusCode === 200) {
        let reg = await this.RegisterUser();
        if (reg.statusCode === 200) {
          this.GetAllMessages();
          let login = await this.LoginUser();
          // this.intervalSubscription = interval(20000).subscribe(() => {
          //   this.GetAllMessages();
          // });
          if (login.statusCode === 200) {
            this.GetAllMessages();
            //await SDK.getUsersList();
            //loading.dismiss();

            //let users = await SDK.getRegisteredUsers();
            let users = await SDK.getUsersList();

            console.log(users);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async GetAllMessages() {
    let chat = await this.getRecentChats();
    let sortedChat: any[] = chat.data;
    sortedChat.sort((a, b) => a.timestamp - b.timestamp);

    UtilService.Chats = chat;
    return chat;
    //this.content.scrollToBottom();
  }

  async LoadSentMessages() {
    let user: any = localStorage.getItem('MsgId');
    let toUserJid = await SDK.getJid(JSON.parse(user));
    let chats = await SDK.getChatMessages(toUserJid.userJid);

    let sortedChat: any[] = chats.data;
    sortedChat.sort((a, b) => a.timestamp - b.timestamp);

    //UtilService.Chats = chat;
    return chats;
    //this.content.scrollToBottom();
  }

  async handleIncomingCall() {
    return await SDK.answerCall();
  }

  async handleEndCall() {
    return await SDK.endCall();
  }

  async handleDeclineCall() {
    return await SDK.declineCall();
  }

  public connectionListener = async (response: any) => {
    if (response.status === 'CONNECTED') {
      console.log('Connection Established');
    } else if (response.status === 'DISCONNECTED') {
      console.log('Disconnected');
      let SDKRegister = await this.RegisterUser();
      if (SDKRegister && SDKRegister.statusCode === 200) await this.LoginUser();
    }
  };

  public presenceListener = (response: any) => {
    console.log('Presence Listener', response);
  };

  public messageListener = (response: any) => {
    console.log('Message Listener', response);
    console.log('STATUS ', this.chatHandler.ChatTypingStatus);
    response.msgType === 'composing'
      ? (this.chatHandler.ChatTypingStatus = 'typing...')
      : (this.chatHandler.ChatTypingStatus = '');
    response.msgType !== 'composing'
      ? (this.chatHandler.ChatTypingStatus = '')
      : (this.chatHandler.ChatTypingStatus = 'typing....');
  };

  public friendsListListener = async (response: any) => {
    console.log('Friends List', response);
  };

  public userProfileListener = async (res: any) => {
    console.log('User Profile Details Listener', res);
  };

  playAudioSoundForIncomingCall(status:any) {
    let audio = new Audio();
    audio.src = "../../assets/ringtone.mp3";
    if(status === 'incoming') {
      audio.load();
      return audio.play();
    }

    if(status === 'end' && status === 'decline') {
      return audio.pause()
    }
  }

  incomingCallListener = (res: any) => {
    if(res.status === 'calling' && res.callType === 'audio') {
      const [username, domain] = res.userJid.split("@");
      this.playAudioSoundForIncomingCall('incoming');
      this.chatHandler.incoming = true;
      this.chatHandler.callerName = username;
      this.chatHandler.callStatus = "Incoming..."
    }
    console.log("Incoming call listener", res);
  };

  callStatusListener = (res: any) => {
    console.log("call status listener", res);
  };
  userTrackListener = (res: any) => {
    console.log("User track listener", res);
  };
  muteStatusListener = (res: any) => {
    console.log("mute listener", res);
  };
  missedCallListener = (res: any) => {
    console.log("Missed call listener", res);
  };
  callSwitchListener = (res: any) => {
    console.log(" call switch listener", res);
  };
  inviteUsersListener = (res: any) => {
    console.log("Invite users listener", res);
  };
  mediaErrorListener = (res: any) => {
    console.log("media error listener", res);
  };
  callSpeakingListener = (res: any) => {
    console.log("call speaking listener", res);
  };
  callUsersUpdateListener = (res: any) => {
    console.log("call user listener", res);
  };
  callUserJoinedListener = (res: any) => {
    console.log("call user joined listener", res);
  };
  callUserLeftListener = (res: any) => {
    console.log("call user left listener", res);

  };

  helper = {
    getDisplayName: async () => {
      let loggedInUser: any = localStorage.getItem('Email');
        let callerInfo = await this.userProfile(JSON.parse(loggedInUser))
        if (callerInfo && callerInfo.nickName) {
            return callerInfo.nickName;
        }
        return "Anonymous user " + Math.floor(Math.random() * 10);
    },
    // getImageUrl: () => {
    //     let vcardData = getLocalUserDetails();
    //     if (vcardData) {
    //         return vcardData.image;
    //     }
    //     return "";
    // }
}

  async InitializeApp() {
    let conn = this.connectionListener;
    const initializeObj = {
      apiBaseUrl: `https://api-preprod-sandbox.mirrorfly.com/api/v1`,
      licenseKey: `1vp4cgag4iGYiP66HOJpa3y9k84KPr`,
      isTrialLicenseKey: true,
      callbackListeners: {
        connectionListener: this.connectionListener,
        messageListener: this.messageListener,
        friendsListListener: this.friendsListListener,
        userProfileListener: this.userProfileListener,
        presenceListener: this.presenceListener,

        incomingCallListener: this.incomingCallListener,
        callStatusListener: this.callStatusListener,
        userTrackListener: this.userTrackListener,
        muteStatusListener: this.muteStatusListener,
        missedCallListener: this.missedCallListener,
        callSwitchListener: this.callSwitchListener,
        inviteUsersListener: this.inviteUsersListener,
        mediaErrorListener: this.mediaErrorListener,
        callSpeakingListener: this.callSpeakingListener,
        callUsersUpdateListener: this.callUsersUpdateListener,
        callUserJoinedListener: this.callUserJoinedListener,
        callUserLeftListener: this.callUserLeftListener,
        helper: this.helper
      },
    };

    let initResponse = await SDK.initializeSDK(initializeObj);
    //console.log(initResponse);
    return initResponse;
  }

  async RegisterUser() {
    let user: any = localStorage.getItem('Email');
    //this.loggedInUser = user;
    let userReg = await SDK.register(JSON.parse(user));
    UtilService.username = userReg.data.username;
    UtilService.password = userReg.data.password;
    // console.log(user);
    //console.log("REQQQQ", userReg);

    return userReg;
  }

  async LoginUser() {
    let login = await SDK.connect(UtilService.username, UtilService.password);
    //console.log(login);
    return login;
  }

  async sendMessage(msg: any) {
    let user: any = localStorage.getItem('MsgId');

    let toUserJid = await SDK.getJid(JSON.parse(user));

    let textMsg = await SDK.sendTextMessage(toUserJid.userJid, msg);
    console.log(textMsg);

    return textMsg;
  }

  async sendImageMessage(media: any) {
    let user: any = localStorage.getItem('MsgId');
    let toUserJid = await SDK.getJid(JSON.parse(user));

    const fileOptions = {
      caption: 'Image caption',
      webWidth: 800,
      webHeight: 600,
    };

    //let msgId = SDK.generateMessageId();
    let msg = await SDK.sendImageMessage(toUserJid.userJid, media, fileOptions);
    console.log(msg);
    return msg;
  }

  async sendSeenStatus() {
    let user: any = localStorage.getItem('MsgId');

    let toUserJid = await SDK.getJid(JSON.parse(user));
    let status = await SDK.sendSeenStatus(
      toUserJid.userJid,
      `c8f1f6c3-2dc6-43e7-9177-aeea47d67aa4`
    );
    console.log(status);
    return status;
  }

  async getRecentChats() {
    let _USERAUTH = await this.RegisterUser();
    if (_USERAUTH && _USERAUTH.statusCode === 200) {
      await this.LoginUser();
      let user: any = localStorage.getItem('MsgId');
      let toUserJid = await SDK.getJid(JSON.parse(user));
      let chats = await SDK.getChatMessages(toUserJid.userJid);
      //console.log(chats);
      return chats;
    }
  }

  async sendTypingStatusToReceiver() {
    let user: any = localStorage.getItem('MsgId');
    let toUserJid = await SDK.getJid(JSON.parse(user));

    let typingStatus = await SDK.sendTypingStatus(toUserJid.userJid);
    //console.log(typingStatus);
    return typingStatus;
  }

  async GetFriends() {
    let users = await SDK.getUsersList();

    UtilService.Chats = users.users;
    //console.log(users);

    return users;
  }

  async GetFriendsWhoWeChat() {
    let _USERAUTH = await this.RegisterUser();
    if (_USERAUTH && _USERAUTH.statusCode === 200) {
      await this.LoginUser();
      let chats = await SDK.getRecentChats();
      console.log(chats.data);

      return chats.data;
    }
  }

  public static GetDateFormat(date: any): any {
    //console.log(date);

    let culture = 'en-US'; // from a service or local st
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

  async loaderCtrl() {
    const loading = await this.loading.create({
      message: 'Loading chats..',
    });

    return loading;
  }

  async userProfile(userId: any) {
    let userprofile = await SDK.getUserProfile(userId);
    console.log(userprofile);
    return userprofile
  }

  async UpdateUserProfile(
    name: any,
    image: any,
    status: any,
    number: any,
    email: any
  ) {
    let profile = await SDK.setUserProfile(name, image, status, number, email);
    console.log(profile);
  }

  async GetLastSeen(userId: any) {
    let toUserJid = await SDK.getJid(JSON.parse(userId));
    let ULS = await SDK.getLastSeen(toUserJid.userJid);
    let secs = this.getLastseen(ULS.data.seconds);
    return secs;
  }

  async GetCurrentUserJid() {
    return await SDK.getCurrentUserJid();
  }

  async GetUserToken() {
    return await SDK.getUserToken(UtilService.username, UtilService.password);
  }

  async Logout() {
    await SDK.logout();
    localStorage.clear();
  }
  datetoTime(secs: any) {
    var todayDate = new Date();
    todayDate.setSeconds(todayDate.getSeconds() - secs);
    return todayDate;
  }

  secondsToHms(secs: any) {
    if (secs === 0) {
      return 0;
    }
    secs = Number(secs);
    var calcHours = Math.floor(secs / 3600);
    return calcHours > 0 ? calcHours : 0;
  }

  findYesterday(secs: any, currentDate: any) {
    let currentDateInSec = currentDate.getUTCHours();
    let remaingSec = this.secondsToHms(secs) - currentDateInSec;
    return remaingSec <= 24 ? true : false;
  }

  getLastseen = (secs: any) => {
    var userDate = this.datetoTime(secs);
    var currentDate = new Date();
    var weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    var month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let HHMM: any = { hour: 'numeric', minute: 'numeric' };
    if (secs === 0) {
      return 'Online';
    } else if (
      userDate.getDate() === currentDate.getDate() &&
      userDate.getMonth() === currentDate.getMonth()
    ) {
      return `last seen today at ${userDate.toLocaleTimeString('en-US', HHMM)}`;
    } else if (
      (userDate.getDate() === currentDate.getDate() - 1 &&
        userDate.getMonth() === currentDate.getMonth()) ||
      (userDate.getMonth() === currentDate.getMonth() - 1 &&
        this.findYesterday(secs, currentDate))
    ) {
      return `last seen yesterday at ${userDate.toLocaleTimeString(
        'en-US',
        HHMM
      )}`;
    } else if (
      (userDate.getDate() === currentDate.getDate() - 1 ||
        userDate.getDate() === currentDate.getDate() - 2 ||
        userDate.getDate() === currentDate.getDate() - 3 ||
        userDate.getDate() === currentDate.getDate() - 4 ||
        userDate.getDate() === currentDate.getDate() - 5 ||
        userDate.getDate() === currentDate.getDate() - 6) &&
      userDate.getMonth() === currentDate.getMonth()
    ) {
      return `last seen on ${
        weekday[userDate.getDay()]
      } at ${userDate.toLocaleTimeString('en-US', HHMM)}`;
    } else {
      if (userDate.getDate().toString().length > 1) {
        return `last seen ${userDate.getDate()}-${
          month[userDate.getMonth()]
        }-${userDate.getFullYear()}`;
      } else {
        return `last seen ${0}${userDate.getDate()}-${
          month[userDate.getMonth()]
        }-${userDate.getFullYear()}`;
      }
    }
  };

  async GetNotification() {
    let options = {
      title: `New message`,
      body: `You just received a new message`,
      onClick: (e: any) => {
        console.log(e);
      },
      forceShow: true,
    };
    let notice = await SDK.showChatNotification(options);
    console.log(notice);
    return notice;
  }

  async makeVideoCall() {
    let user1: any = localStorage.getItem('Email');
    let user2: any = localStorage.getItem('MsgId');

    let User1Jid = await SDK.getJid(JSON.parse(user1));
    let User2Jid = await SDK.getJid(JSON.parse(user2));
    console.log(User1Jid)
    let response = await SDK.makeVideoCall([User1Jid.userJid, User2Jid.userJid]);
    console.log(response);

    return response;
  }

  async makeVoiceCall() {
    let user1: any = localStorage.getItem('Email');
    let user2: any = localStorage.getItem('MsgId');

    let User1Jid = await SDK.getJid(JSON.parse(user1));
    let User2Jid = await SDK.getJid(JSON.parse(user2));

    console.log(User2Jid)
    console.log(User2Jid.userJid)
    let response = await SDK.makeVoiceCall([User2Jid.userJid]);
    console.log("Response", response);

    return response;
  }


  // encryptAndStoreInLocalStorage(key, data) {
  //     let ecytData = encrypt(JSON.stringify(data), key);
  //     let encryptedKey = encrypt(key, REACT_APP_LICENSE_KEY);
  //     ls.setItem(encryptedKey, ecytData);
  //     return true;
  // }

  // getFromLocalStorageAndDecrypt(key) {
  //     let encryptedKey = encrypt(key, REACT_APP_LICENSE_KEY);
  //     let lsData = ls.getItem(encryptedKey);
  //     try {
  //         let dcypData = decrypt(lsData, key);
  //         return JSON.parse(dcypData);
  //     } catch (error){
  //         return lsData;
  //     }
  // }

  // encrypt = (data, key) => {
  //   const encryptKey = Cryptlib.getHashSha256(key, 32); // import Cryptlib from "cryptlib";
  //   return Cryptlib.encrypt(encodeURIComponent(data), encryptKey, REACT_APP_ENCRYPT_KEY);
  // };

  // decrypt = (data, key) => {
  //   const decryptKey = Cryptlib.getHashSha256(key, 32);
  //   return decodeURIComponent(Cryptlib.decrypt(data, decryptKey, REACT_APP_ENCRYPT_KEY));
  // };

}
