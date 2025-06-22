import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>(); 
  contactListChangedEvent = new Subject<Contact[]>();
  // EventEmitter is used to emit events when the contacts change
  private maxContactId: number;

  contacts: Contact[] = [];
  constructor(private http: HttpClient) { 
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    this.http.get<Contact[]>('https://my-cms-project-a45a2-default-rtdb.firebaseio.com/contacts.json')
      .subscribe({
        next: (contacts) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          this.contacts.sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (error) => {
          console.error('Error fetching contacts:', error);
        }
      })
  }


  // getContacts(): Contact[] {
  //   return this.contacts.slice();
  // }

  storeContacts() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://my-cms-project-a45a2-default-rtdb.firebaseio.com/contacts.json',
      JSON.stringify(this.contacts), { headers: headers })
      .subscribe({
        next: () => {
          const contactsListClone = this.contacts.slice();
          this.contactListChangedEvent.next(contactsListClone);
        },
        error: (error) => {
          console.error('Error storing contacts:', error);
        }
      });
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) {
       if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos <0) {
      return;
    }
    this.contacts.splice(pos, 1);
    // const contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
}

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    // const contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    // Update the contacts array with the new contact

    // const contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }
}
