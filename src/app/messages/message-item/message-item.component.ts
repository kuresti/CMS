import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent {
  @Input() message: Message;
  messageSender: string;
  @Output() messageSelected = new EventEmitter<Message>();

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    const contact: Contact =  this.contactService.getContact(this.message.sender);
    this.messageSender = contact?.name || 'Kimberly Uresti';
  }

  onMessageClicked() {
    this.messageSelected.emit(this.message);
  }
}
