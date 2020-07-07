import { Component } from '@angular/core';
import * as firebase from 'firebase';

const config  = {
  apikey: 'AIzaSyA4LtoOOwAHUuFPG_K-MzwAgjDy9oN1LzM',
  databaseURL: 'https://opeeroomts.firebaseio.com/'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'openroomTS';

  constructor(){
    firebase.initializeApp(config); 
  }
}
