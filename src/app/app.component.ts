import { Component } from '@angular/core';
import { ChatHandler } from './services/chathandler.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  {
  constructor(public chatHandler: ChatHandler) {}
}
