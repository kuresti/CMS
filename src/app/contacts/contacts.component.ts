import { Component, OnInit } from '@angular/core';

import { Contact } from '../contacts/contact.model';
import { ContactService } from '../contacts/contact.service';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
    contacts: Contact[] = [];

    constructor(private contactService: ContactService) { }

    ngOnInit() {
       this.contacts = this.contactService.getContacts();
}
}
