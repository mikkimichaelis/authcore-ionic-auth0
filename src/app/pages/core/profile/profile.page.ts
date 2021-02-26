import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BUSY_SERVICE, IBusyService, IToastService, IUserService, TOAST_SERVICE, USER_SERVICE } from '../../../services';
import { IUser } from 'src/shared/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userForm: FormGroup;
  user: IUser;

  constructor(private formBuilder: FormBuilder,
    private location: Location,
    @Inject(BUSY_SERVICE) private busyService: IBusyService,
    @Inject(TOAST_SERVICE) private toastService: IToastService,
    @Inject(USER_SERVICE) private userService: IUserService) {
      this.initialize();
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.initialize();
  }

  initialize() {
    this.user = this.userService._user.toObject();
    this.userForm = this.formBuilder.group({
      "firstName": [this.user.profile.firstName, [Validators.required, Validators.minLength(3)]],
      "lastInitial": [this.user.profile.lastInitial, [Validators.required, Validators.maxLength(1)]],
    })
  }

  async submitForm() {
    if (this.userForm.valid) {
      try {
        await this.busyService.present('Saving Changes');
        await this.userService.setName(this.userForm.value.firstName, this.userForm.value.lastInitial);
        this.location.back();
      } catch (e) {
        this.initialize();
        await this.toastService.present('Error saving changes')
      } finally {
        await this.busyService.dismiss();
      }
    }
  }
}
