import { Component, Output, EventEmitter } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  
  @Output() addedMessageEvent = new EventEmitter<Message>();
  
  messages: Message[] = [
    new Message('1', 'Assignment', 'I have a question about the assignment.', 'Kimberly Uresti'),
    new Message('2', 'Office Hours', 'I am happy to answer your question in my office hours today at 1:00p.m.', 'R. Kent Jackson'),
    new Message('3', 'Thank you', 'Thank you so much for your help today!', 'Kimberly Uresti'),
    new Message('4', 'Announcement', 'This next week we will be learning about Services and Dependency Injection', 'R. Kent Jackson')
  ]

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
