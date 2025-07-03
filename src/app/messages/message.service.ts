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
private sortAndSend() {
  // Sorts documents by name
  this.messages.sort((a, b) => a.subject.localeCompare(b.subject));

  // Emits a copy of the array to subscribers
  this.messagesChanged.next(this.messages.slice());
}

  getMessages() {
    this.http.get<Message[]>('http://localhost:3000/messages')
      .subscribe({
        next: (messages) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.sortAndSend();
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


  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }

    //Make sure the id of the new message is empty
    newMessage.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http.post<{ message: string, message: Message }>('http://localhost:3000/messages',
      newMessage,
      { headers: headers })
      .subscribe(
        (responseData) => {
          //add new message to message list
          this.messages.push(responseData.message);
          this.sortAndSend();
        }
      );
    // this.messages.push(message); 
    // this.storeMessages();
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Message to the id of the old Message
    newMessage.id = originalMessage.id;
    // newMessage._id = originalMessage._id;

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    //update database
    this.http.put('http://localhost:3000/messages/' + originalMessage.id,
      newMessage, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.messages[pos] = newMessage;
          this.sortAndSend();
        }
      );    
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }
    
    const pos = this.messages.findIndex(m => m.id === message.id);

    if (pos < 0 ) {
      return;
    }
    //delete from database
    this.http.delete('http://localhost:3000/messages/' + message.id)
    .subscribe(
      (response: Response) => {
        this.messages.splice(pos, 1);
        this.sortAndSend();
      }
    ); 
  }
}
