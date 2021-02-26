import { Component, OnInit } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private emailComposer: EmailComposer) { }

  ngOnInit() {
  }

  openSupportTicket() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }

     
     let email = {
       to: 'support@newaccount1612218979655.freshdesk.com',
       //cc: 'erika@mustermann.de',
       //bcc: ['john@doe.com', 'jane@doe.com'],
      //  attachments: [
      //    'file://img/logo.png',
      //    'res://icon.png',
      //    'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
      //    'file://README.pdf'
      //  ],
       subject: 'WhitsApp Support',
       body: '',
       isHtml: true
     };
     
     // Send a text message using default options
     this.emailComposer.open(email);
    });
  }
}
