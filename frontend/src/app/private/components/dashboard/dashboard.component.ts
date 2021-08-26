import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit  {

  rooms$ = this.chatService.getMyRooms(); 
  selectedRoom = null;

  constructor(private chatService: ChatService) { }

  ngOnInit() {   
    
  }

  ngAfterViewInit() {
    this.chatService.emitPaginateRoom(2,0);
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    console.log('hello paula', '  page size ===> ',pageEvent.pageSize, 'pageIndez ====> ',pageEvent.pageIndex);
    this.chatService.emitPaginateRoom(pageEvent.pageSize, pageEvent.pageIndex);
  }

}
