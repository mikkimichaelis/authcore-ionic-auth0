import { Component, Inject, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserService, USER_SERVICE } from 'src/app/services';

import { Zoom } from '@ionic-native/zoom/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.page.html',
  styleUrls: ['./zoom.page.scss'],
})
export class ZoomPage implements OnInit {

  meetingNumber = '';
  meetingPassword = '';
  displayName = '';

  constructor(    
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private zoomService: Zoom,
    @Inject(USER_SERVICE) private userService: UserService) { }

  ngOnInit() {
    this.displayName = this.userService._user.name;
  }

  ionViewDidEnter() {
    this.meetingNumber = this.route.snapshot.queryParamMap.get('meetingNumber');
    this.meetingPassword = this.route.snapshot.queryParamMap.get('meetingPassword');
    this.displayName = this.userService._user.name;

    this.joinMeeting();
  }

  ionViewDidLeave() {
 
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  joinMeeting() {
    console.log('Going to join meeting');
    // Prepare meeting option
    const options = {
      custom_meeting_id: "Customized Title",
      no_share: false,
      no_audio: false,
      no_video: false,
      no_driving_mode: true,
      no_invite: true,
      no_meeting_end_message: true,
      no_dial_in_via_phone: false,
      no_dial_out_to_phone: false,
      no_disconnect_audio: true,
      no_meeting_error_message: true,
      no_unmute_confirm_dialog: true,
      no_webinar_register_dialog: false,
      no_titlebar: false,
      no_bottom_toolbar: false,
      no_button_video: false,
      no_button_audio: false,
      no_button_share: false,
      no_button_participants: false,
      no_button_more: false,
      no_text_password: true,
      no_text_meeting_id: false,
      no_button_leave: false
    };
    // Call join meeting method.
    this.zoomService.joinMeeting(this.meetingNumber, this.meetingPassword, this.displayName, options)
        .then((success) => {
          console.log(success);
          this.presentToast(success);
          this.meetingNumber = null;
          this.meetingPassword = null;
        }).catch((error) => {
          console.log(error);
          this.presentToast(error);
    });
  }
}
