import { Component } from '@angular/core';

import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  
 
  
  messages: Message[] = [];

    
    constructor(private messageService: MessageService) {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

  ngOnInit() {
    this.messageService.getMessages();
    this.messageService.messagesChanged.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    );
  } 

}
