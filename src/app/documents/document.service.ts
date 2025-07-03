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

  private sortAndSend() {
    // Sorts documents by name
    this.documents.sort((a, b) => a.name.localeCompare(b.name));

    // Emit a copy of the array to subscribers
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments() {
    this.http.get<Document[]>('http://localhost:3000/documents')
      .subscribe({
        next: (documents) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.sortAndSend();
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
    this.http.put('http://localhost:3000/documents',
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
    //const pos = this.documents.indexOf(document);
    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }
    //delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      }
    );    
    // const documentsListClone = this.documents.slice();
    // this.storeDocuments();
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
    // Make sure the id of the new document is empty
    newDocument.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http.post<{ message:string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents list
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
   }
  //   this.maxDocumentId++;
  //   newDocument.id = this.maxDocumentId.toString();
  //   this.documents.push(newDocument);
  //   const documentsListClone = this.documents.slice();
  //   this.storeDocuments();
  // }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    //newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }
  //   )
  //   const pos = this.documents.indexOf(originalDocument);
  //   if( pos < 0) {
  //     return;
  //   }
  //   newDocument.id = originalDocument.id; // Ensure the ID remains the same
  //   this.documents[pos] = newDocument;

  //   const documentsListClone = this.documents.slice();
  //   this.storeDocuments();
  //   }
  // }

  
}
