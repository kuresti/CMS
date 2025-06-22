import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesChanged = new Subject<Message[]>();
  messages: Message[] = [];
// The messagesChanged EventEmitter is used to notify components when the messages array changes.
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
   }

//   getMessages(): Message[] {
//     return this.messages.slice();
// }
  getMessages() {
    this.http.get<Message[]>('https://my-cms-project-a45a2-default-rtdb.firebaseio.com/messages.json')
      .subscribe({
        next: (messages) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messages.sort((a, b) => a.subject.localeCompare(b.subject));
          this.messagesChanged.next(this.messages.slice());
        }
      })
  }

  storeMessages() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://my-cms-project-a45a2-default-rtdb.firebaseio.com/messages.json',
      JSON.stringify(this.messages), { headers: headers })
      .subscribe({
        next: () => {
          const messagesListClone = this.messages.slice();
          this.messagesChanged.next(messagesListClone);
        },
        error: (error) => {
          console.error('Error storing messages:', error);
        }
      });    
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }


  addMessage(message: Message) {
    this.messages.push(message); 
    this.storeMessages();
  }
}
