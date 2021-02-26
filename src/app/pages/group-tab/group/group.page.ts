import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
// import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import * as _ from 'lodash';
import { IGroup } from 'src/shared/models';

import { BusyService, BUSY_SERVICE, GROUP_SERVICE, IBusyService, IGroupService, IToastService, IUserService, TOAST_SERVICE, USER_SERVICE } from '../../../services';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  public get isHomeGroup(): boolean {
    return this.groupSvc.group.isHomeGroup(this.userService._user);
  }

  public get isFavorite(): boolean {
    return this.groupSvc.group.isFavorite(this.userService._user);
  }

  contacts: any;

  constructor(
    public route: ActivatedRoute,
    public alertController: AlertController,
    public busySvc: BusyService,
    //public contacts: Contacts,
    @Inject(BUSY_SERVICE) public busyService: IBusyService,
    @Inject(TOAST_SERVICE) public toastService: IToastService,
    @Inject(USER_SERVICE) public userService: IUserService,
    @Inject(GROUP_SERVICE) public groupSvc: IGroupService) { }

  async ngOnInit() {
    
  }

  async ionViewWillEnter() {
    let id = this.route.snapshot.queryParamMap.get('id');
    if (!id) {
      id = _.get(this.userService._user, 'homeGroup.id');
    }
    try {
      await this.busySvc.present();
      await this.groupSvc.getGroupAsync(id);
    } catch (e) {
      console.log(e);
    } finally {
      await this.busySvc.dismiss();
    }
  }

  async makeHomegroup(group: IGroup) {
    const alert = await this.alertController.create({
      header: 'Homegroup',
      subHeader: 'Confirm',
      message: `Make ${group.name} your homegroup?`,
      buttons: ['Cancel',
        {
          text: 'OK',
          handler: async () => {
            try {
              await this.busyService.present('Saving Changes');
              await this.userService.makeHomeGroup(group.id)
            } catch (e) {
              await this.toastService.present('Error saving changes')
            } finally {
              await this.busyService.dismiss();
            }
          }
        }]
    });
    await alert.present();
  }

  async makeFavGroup(group: IGroup, make: boolean) {
    try {
      await this.busyService.present('Saving Changes');
      await this.userService.makeFavGroup(group.id, make);
    } catch (e) {
      await this.toastService.present('Error saving changes')
    } finally {
      await this.busyService.dismiss();
    }
  }

  async makeContact(group: IGroup) {
    // let contact: Contact = this.contacts.create();

    // contact.name = new ContactName(null, group.name, group.location.name);
    // contact.phoneNumbers = [new ContactField('business', group.telephone)];
    // contact.save().then(
    //   () => console.log('Contact saved!', contact),
    //   (error: any) => console.error('Error saving contact.', error)
    // );
  }
}
