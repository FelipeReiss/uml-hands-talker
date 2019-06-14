import { UserFirestore } from './../../../auth/models/userFirestore.model';
import { Input, Output, EventEmitter, Component } from '@angular/core';

@Component ({
  selector: 'app-user-item-admin',
  templateUrl: './user-item-admin.component.html',
  styleUrls: ['./user-item-admin.component.scss'],
})
export class UserItemAdminComponent {

  @Input() user: UserFirestore;
  @Output() admin = new EventEmitter<UserFirestore>();
  @Output() delete = new EventEmitter<UserFirestore>();
}
