import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();  
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  private maxDocumentId: number;

  constructor(private http: HttpClient) { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    this.http.get<Document[]>('https://my-cms-project-a45a2-default-rtdb.firebaseio.com/documents.json')
      .subscribe({
        next: (documents) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (error) => {
          console.error('Error fetching documents:', error);

        }
      })
  }
  // getDocuments(): Document[] {
  //   return this.documents.slice();
  // }

  storeDocuments() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://my-cms-project-a45a2-default-rtdb.firebaseio.com/documents.json',
      JSON.stringify(this.documents), { headers: headers })
      .subscribe({
        next: () => {
          const documentsListClone = this.documents.slice();
          this.documentListChangedEvent.next(documentsListClone);
        },
        error: (error) => {
          console.error('Error storing documents:', error);
        }
      });
  }
  
  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    const documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
        }
      }
      return maxId;
    }
  
  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    const documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if( pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id; // Ensure the ID remains the same
    this.documents[pos] = newDocument;

    const documentsListClone = this.documents.slice();
    this.storeDocuments();
    }
  }

  

