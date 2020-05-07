import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  newPost = 'No Content';
  enteredValue = '';
 /*  onAddPost(postInput: HTMLTextAreaElement) {
    console.log(postInput);
    console.dir(postInput);
    this.newPost = postInput.value;
  } */
}
