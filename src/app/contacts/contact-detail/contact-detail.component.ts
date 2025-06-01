import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  contact: Contact
  id: string;
  constructor(private contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        console.log('ID from route:', id);
        this.contact = this.contactService.getContact(id);
        console.log('Contact found:', this.contact);
      })
    }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }
 


//  contact: Contact = new Contact( 
//  '1',
//  'R. Kent Jackson',
//  'jackson@byui.edu',
//  '208-496-3771',
//  'assets/images/jacksonk.jpg',
//  []
//  );
 


}