import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  stats: any = {
    totalChauffeurs: 0,
    totalPassagers: 0,
    totalCourses: 0,
    totalPaiements: 0,
    totalAvis: 0
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.api.getAdminStats().subscribe({

      next: (data) => {

        console.log('Dashboard Admin', data);

        this.stats = data;

      },

      error: (err) => {

        console.error('Erreur Dashboard', err);

      }

    });

  }
}
