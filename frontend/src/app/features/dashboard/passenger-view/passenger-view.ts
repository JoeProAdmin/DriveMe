import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-passenger-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './passenger-view.html',
  styleUrls: ['./passenger-view.css']
})
export class PassengerViewComponent {
  public passengerName = 'Passager DriveMe';

  public stats = {
    totalCourses: 0,
    coursesEnAttente: 0,
    coursesTerminees: 0,
    avisDonnes: 0
  };
}
