import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ChatHandler{
    ChatTypingStatus = '';
    incoming:boolean = false;
    callerName:any = '';
    callStatus:any = '';

    constructor(){}
}
