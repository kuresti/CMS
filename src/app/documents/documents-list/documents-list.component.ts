import { Component, Output, EventEmitter} from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'cms-documents-list',
  standalone: false,
  templateUrl: './documents-list.component.html',
  styleUrl: './documents-list.component.css'
})
export class DocumentsListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

 documents: Document[] = [
  new Document(1,'CIT 280 ', 'Object Oriented Programming', 'https://content.byui.edu/CIT280', null ),
  new Document(2,'CIT 366', 'Full Web Stack Development', 'https//content.byui.edu/CIT366', null),
  new Document(3,'CIT 425', 'Data Warehousing', 'https//content.byui.edu/CIT 425', null),
  new Document(4,'CIT 480', 'Enterprise Development', 'https//content.byui.edu/CIT480', null),
  new Document(5, 'CIT 495', 'Senior Practicum', 'https//content.byui.edu/CIT495', null),  
 ]

 onSelectedDocument(document: Document){
  this.selectedDocumentEvent.emit(document);
 }
}
