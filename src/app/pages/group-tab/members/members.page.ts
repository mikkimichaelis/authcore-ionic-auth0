import { Component, Inject, OnInit } from '@angular/core';
import { IGroupService } from 'src/app/services';
import { GROUP_SERVICE } from 'src/app/services/injection-tokens';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit {

  constructor(@Inject(GROUP_SERVICE) public groupService: IGroupService) { }

  ngOnInit() {
  }

}
