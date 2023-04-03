import { Component, OnInit } from '@angular/core';

declare var SDK: any;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  USR_IDENTIFIER = {
    username: "",
    password: ""
  }

  user1 = "1F7675433234467kjjhghgf";
  user2 = "287675fgftrreddfbnhgh5D"
  constructor() {}
  ngOnInit(): void {
    this.InitializeApp();

  }

  public friendsListListener = function (response:any) {
    console.log("Friends List", response);
  }

  public connectionListener = function(response: any): any {
    if (response.status === "CONNECTED") {
      console.log("Connection Established");
    } else if (response.status === "DISCONNECTED") {
      console.log("Disconnected");
    }
  }

  public messageListener = function(response:any) {
    console.log("Message Listener", response);
  }


  async InitializeApp() {
    let conn = this.connectionListener
    const initializeObj = {
      apiBaseUrl: `https://api-preprod-sandbox.mirrorfly.com/api/v1`,
      licenseKey: `1vp4cgag4iGYiP66HOJpa3y9k84KPr`,
      isTrialLicenseKey: true,
      callbackListeners: {
        connectionListener: conn,
        messageListener: this.messageListener,
        friendsListListener: this.friendsListListener,
      },
    };

    let initResponse =  await SDK.initializeSDK(initializeObj);
    console.log(initResponse);

    // await SDK.register(this.USR_IDENTIFIER);
    // await SDK.connect(this.USR_IDENTIFIER.username, this.USR_IDENTIFIER.password);
  }

  async RegisterUser() {
    let userReg = await SDK.register(this.user1);
    console.log(userReg);
    this.USR_IDENTIFIER.username = userReg.data.username
    this.USR_IDENTIFIER.password = userReg.data.password

  }

  async LoginUser() {
    let login = await SDK.connect(this.USR_IDENTIFIER.username, this.USR_IDENTIFIER.password);
    console.log(login);
  }

  async RegisterUser1() {
    let userReg = await SDK.register(this.user2);
    console.log(userReg);
    this.USR_IDENTIFIER.username = userReg.data.username
    this.USR_IDENTIFIER.password = userReg.data.password

  }

  async sendMessage() {
    let msg = "T0 user 2";
    let toUserJid = SDK.getJid(this.user2);

    let textMsg = await SDK.sendTextMessage(toUserJid.userJid, msg);
    console.log(textMsg);
  }

  async sendMessage1() {
    let msg = "To user 1";
    let toUserJid = SDK.getJid(this.user1);

    let textMsg = await SDK.sendTextMessage(toUserJid.userJid, msg);
    console.log(textMsg);
  }

  async getRecentChats() {
    let toUserJid = SDK.getJid(this.user1);
    console.log(toUserJid);

    let chats =await SDK.getChatMessages(toUserJid.userJid);
    console.log(chats);

  }

  async getRecentChats1() {
    let toUserJid = SDK.getJid(this.user2);
    console.log(toUserJid);

    let chats =await SDK.getChatMessages(toUserJid.userJid);
    console.log(chats);

  }

}
