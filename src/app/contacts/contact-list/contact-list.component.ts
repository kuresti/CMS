import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  // The contacts array will hold the list of Contact objects;
  @Input() term: string = '';
  // The contacts array will hold the list of Contact objects
  contacts: Contact[] = [];  

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contactService.getContacts();
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contact: Contact[]) => {
        this.contacts = contact;}
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  
}
