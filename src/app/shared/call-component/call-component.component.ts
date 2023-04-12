import { Component, OnInit } from '@angular/core';
import { ChatHandler } from 'src/app/services/chathandler.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-call-component',
  templateUrl: './call-component.component.html',
  styleUrls: ['./call-component.component.scss'],
})
export class CallComponentComponent  implements OnInit {

  constructor(public chatHandler: ChatHandler, private util:UtilService) { }

  ngOnInit() {}

  async answerCall() {
    await this.util.handleIncomingCall().then(res => console.log(res))
  }

  async endCall() {
    this.chatHandler.callStatus = '';
    this.chatHandler.incoming = false;
    await this.util.handleEndCall().then(res => console.log(res));
    this.util.playAudioSoundForIncomingCall('end');
  }

  async declineCall() {
    this.chatHandler.callStatus = '';
    this.chatHandler.incoming = false;
    await this.util.handleDeclineCall().then(res => console.log(res));
    this.util.playAudioSoundForIncomingCall('decline');
  }

}
