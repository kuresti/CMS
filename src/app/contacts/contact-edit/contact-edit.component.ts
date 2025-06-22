import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { J } from '@angular/cdk/keycodes';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit {
    
    contact: Contact = new Contact('','','','','',[]);
    originalContact: Contact;
    editMode: boolean = false;
    id: string;
    groupContacts: Contact[] = [];
    contacts: Contact[] = [];
    invalidGroupContact: boolean = false;
    contactDropListId = 'contactEditList';
    // The contactDropListId is used to identify the drop list for dragging and dropping contacts into the groupContacts array.
    groupDropListId = 'groupContactList';
   

  constructor (private contactService: ContactService,
               private router: Router,
               private route: ActivatedRoute
  ) {}  

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id']
        if (!id) {
          this.editMode = false;
          return;
          
    
        }
          this.contactService.getContacts();

       this.originalContact = this.contactService.getContact(id);
       if (!this.originalContact) {
        return;
       }

       this.editMode = true;
      

       this.contact = JSON.parse(JSON.stringify(this.originalContact));

      
       if(this.contact.group) {
        this.groupContacts = this.contact.group.slice();
       }
        this.contactService.getContacts();
      }
    );
  }

   onSubmit(form: NgForm) {
      const value = form.value;
      const newContact = new Contact(value.id, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
      if (this.editMode) {
        this.contactService.updateContact(this.originalContact, newContact)
      } else {
        this.contactService.addContact(newContact)
      }
      this.router.navigate(['/contacts'], {relativeTo: this.route});
    }

   onCancel() {
      this.router.navigate(['/contacts']);
   }

   onRemoveItem(index: number) {
     //if (index >= 0 && index < this.groupContacts.length) {
    //   this.groupContacts.splice(index, 1)
    //  }
    // if (index < 0 || index >= this.groupContacts.length) {
    //   return;
    // }
    this.groupContacts.splice(index, 1);
   }

  onDropContact(event: CdkDragDrop<Contact[]>) {
    const draggedContact: Contact = event.item.data;
    
    if (this.isInvalidContact(draggedContact)) {
      this.invalidGroupContact = true;
      setTimeout(() => this.invalidGroupContact = false, 2000);
      return;
    }

    this.groupContacts.push(draggedContact);
   }

   isInvalidContact(contact: Contact) {
    if (!contact) return true;
    if (contact.id === this.contact?.id) return true;
    return this.groupContacts.some((c) => c.id === contact.id);
   }
  }
  //  addToGroup(event: CdkDragDrop<Contact[]>) {
  //   console.log('DROP EVENT:', event);
  //   if (!event.isPointerOverContainer) {
  //     console.warn('Drop ignored: not over container');
  //     return;
  //   }
  //   // Get the contact being dragged
  //   const selectedContact = event.item.data;

  //   // Prevent invalid contacts from being added
  // if (!selectedContact || this.groupContacts.some(c => c.id === selectedContact.id) || selectedContact.id === this.contact?.id) {
  //   return;
  // }

  //   // Add to groupContacts array
  //   this.groupContacts.push(selectedContact);
  //   console.log('GROUP CONTACTS AFTER ADD:', this.groupContacts)
  //  }


