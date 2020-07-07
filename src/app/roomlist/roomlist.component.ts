import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router}from '@angular/router'; 
import * as firebase from 'firebase'; 
import {DatePipe} from '@angular/common'; 

//transform the snapshot data (key value pairs) into array
export const snapshotToArray = (snapshot: any)=> {
  const returnArr = []; 

  snapshot.forEach((childSnapshot: any)=> {
    const item = childSnapshot.val();
    item.key = childSnapshot.key; 
    returnArr.push(item); 
  });

  return returnArr; 
}


@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {

  //declare the required vars
  nickname= ''; 
  displayedColumns: string [] = ['roomname']; 
  rooms = []; 
  isLoadingResults = true; 

  //inject the necessary dependencies
  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) { 
    
    //initialize the control value and convert the firebase response into array list of rooms
    this.nickname = localStorage.getItem('nickname'); 
    firebase.database().ref('rooms/').on('value', res => {
      this.rooms = []; 
      this.rooms = snapshotToArray(res); 
      this.isLoadingResults = false; 
    });
  }

  ngOnInit(): void {
  }
  //create a function that will allow users navigate to the desired room in the array of rooms
  enterChatRoom(roomname: string){
    const chat = {roomname: '', nickname: '', message:'', date:'', type: ''}; 
    chat.roomname = roomname;
    chat.nickname = this.nickname; 
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'); 
    chat.message = `${this.nickname } has entered the room`; 
    chat.type = 'join'; 
    const newMessage = firebase.database().ref('chat/').push(); 
    newMessage.set(chat); 

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (res: any)=>{

      let roomuser= []; 

      roomuser = snapshotToArray(res);
      const user = roomuser.find(y => y.nickname === this.nickname);
      if(user !== undefined){
        const userRef = firebase.database().ref('roomusers/' + user.key); 
        userRef.update({status: 'online'}); 

      }else{
        const newroomuser = {roomname: '', nickname: '', status: ''};
        newroomuser.roomname = roomname; 
        newroomuser.nickname = this.nickname; 
        newroomuser.status = 'online'; 
        const newRoomUser = firebase.database().ref('roomusers/').push(); 
        newRoomUser.set(newroomuser);

      }
    });

    this.router.navigate(['/chatroom', roomname]); 
  }
  //implement logout method

  logout(): void{
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }
}
