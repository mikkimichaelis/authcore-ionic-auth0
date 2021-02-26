import { Inject, Injectable } from '@angular/core';
import { Zoom } from '@ionic-native/zoom/ngx';
import { ToastController } from '@ionic/angular';
import { USER_SERVICE } from './injection-tokens';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class ZoomService {

  constructor(private toastCtrl: ToastController,
    private zoomService: Zoom,
    @Inject(USER_SERVICE) private userService: UserService) { }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  joinMeeting(
    meetingNumber: string,
    meetingPassword: string,
    meetingTitle: string,
    displayName: string
  ): Promise<any> {
    console.log('Going to join meeting');

    // Prepare meeting option
    const options = {
      custom_meeting_id: meetingTitle,
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
    return this.zoomService.joinMeeting(meetingNumber, meetingPassword, `[WhitsApp] ${displayName}`, options);
  }
}
