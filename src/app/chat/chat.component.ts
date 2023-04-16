import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

   myText:string='';
   displayMessage:string='';

   onSubmit()
   {
      this.displayMessage=this.myText;
      this.myText='';
   }
   onClear()
   {
    this.displayMessage='';
   }

}
