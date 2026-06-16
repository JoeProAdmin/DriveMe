import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, ChauffeurResponseDTO } from '../../core/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  userRole = '';
  userEmail = '';

  today = new Date();

  chauffeur?: ChauffeurResponseDTO;

  noteMoyenne = 0;
  soldeCredit = 0;

  loading = true;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    this.userRole = localStorage.getItem('userRole') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';

    if (
      this.userRole !== 'CHAUFFEUR' ||
      !this.userEmail
    ) {
      this.loading = false;
      return;
    }

    this.loadChauffeurProfile();
  }

  private loadChauffeurProfile(): void {

    this.loading = true;

    this.apiService.getChauffeurByEmail(this.userEmail).subscribe({

      next: (chauffeur: ChauffeurResponseDTO) => {

        this.chauffeur = chauffeur;

        this.noteMoyenne = Number(
          chauffeur.noteMoyenne ?? 0
        );

        this.soldeCredit = Number(
          chauffeur.soldeCredit ?? 0
        );

        this.loading = false;

        console.log('PROFIL CHAUFFEUR FINAL', chauffeur);
      },

      error: (err: any) => {

        console.error(
          'Erreur chargement profil chauffeur',
          err
        );

        this.noteMoyenne = 0;
        this.soldeCredit = 0;

        this.loading = false;
      }
    });
  }
}
