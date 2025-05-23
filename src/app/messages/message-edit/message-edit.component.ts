import { Component,  ViewChild, ElementRef } from '@angular/core';

import { Message } from '../message.model'
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
 @ViewChild('subject') subjectRef:ElementRef;
 @ViewChild('msgText') msgTextRef:ElementRef;
 
  currentSender: string = '100'; // hardcoded for now

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    //const id = Date.now().toString();
    const id = '100'    
    const subject = this.subjectRef.nativeElement.value;
    const msgText = this.msgTextRef.nativeElement.value;

    const newMessage = new Message(id, subject, msgText, this.currentSender);
         this.messageService.addMessage(newMessage);


  }

  onClear() {
   this.subjectRef.nativeElement.value = '';
   this.msgTextRef.nativeElement.value = '';
   
  }
}
