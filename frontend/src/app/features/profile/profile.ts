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

  noteMoyenne = Number(localStorage.getItem('chauffeurNoteMoyenne') || 0);
  soldeCredit = Number(localStorage.getItem('chauffeurSoldeCredit') || 0);

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';

    if (this.userRole === 'CHAUFFEUR' && this.userEmail) {
      this.loadChauffeurProfile();
    }
  }

  private loadChauffeurProfile(): void {
    this.apiService.getChauffeurByEmail(this.userEmail).subscribe({
      next: (chauffeur: ChauffeurResponseDTO) => {
        this.chauffeur = chauffeur;

        this.noteMoyenne = Number(chauffeur.noteMoyenne ?? 0);
        this.soldeCredit = Number(chauffeur.soldeCredit ?? 0);

        localStorage.setItem('chauffeurNoteMoyenne', String(this.noteMoyenne));
        localStorage.setItem('chauffeurSoldeCredit', String(this.soldeCredit));
      },
      error: (err: any) => {
        console.error('Erreur chargement profil chauffeur', err);
      }
    });
  }
}
