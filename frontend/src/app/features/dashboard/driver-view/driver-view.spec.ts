import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-view.html',
  styleUrls: ['./driver-view.css']
})
export class DriverViewComponent {

  public stats = {
    coursesTotal: 12,
    coursesEnCours: 2,
    revenus: 1450,
    note: 4.8
  };

}
