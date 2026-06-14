import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  userRole = localStorage.getItem('userRole') || '';
  userEmail = localStorage.getItem('userEmail') || '';

  today = new Date();

  noteMoyenne = 0;
  soldeCredit = 0;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    if (this.userRole === 'CHAUFFEUR') {
      this.apiService.getAllChauffeurs().subscribe({
        next: (chauffeurs: any[]) => {
          if (chauffeurs && chauffeurs.length > 0) {
            const chauffeur = chauffeurs[0];

            this.noteMoyenne = chauffeur.noteMoyenne || 0;
            this.soldeCredit = chauffeur.soldeCredit || 0;
          }
        },
        error: (err: any) => {
          console.error('Erreur chargement chauffeur :', err);
        }
      });
    }
  }
}
