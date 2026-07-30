import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, PassagerResponseDTO } from '../../../core/api.service';

@Component({
  selector: 'app-passenger-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passenger-management.html',
  styleUrls: ['./passenger-management.css']
})
export class PassengerManagementComponent implements OnInit {
  public passagers: PassagerResponseDTO[] = [];
  public searchTerm = '';
  public isLoading = false;
  public errorMessage = '';
  public selectedPassager: PassagerResponseDTO | null = null;
  public editedPassager: PassagerResponseDTO | null = null;
  public isSaving = false;

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPassagers();
  }

  public loadPassagers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getAllPassagers().subscribe({
      next: (data) => {
        this.passagers = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement passagers', error);
        this.errorMessage = 'Impossible de charger la liste des passagers.';
        this.isLoading = false;
      }
    });
  }

  public get filteredPassagers(): PassagerResponseDTO[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.passagers;
    }

    return this.passagers.filter((passager) =>
      [passager.id, passager.nom, passager.prenom, passager.email, passager.telephone]
        .some((value) => String(value ?? '').toLowerCase().includes(term))
    );
  }

  public openDetails(passager: PassagerResponseDTO): void {
    this.selectedPassager = { ...passager };
    this.editedPassager = null;
  }

  public openEdit(passager: PassagerResponseDTO): void {
    this.editedPassager = { ...passager };
    this.selectedPassager = null;
  }

  public closePanel(): void {
    this.selectedPassager = null;
    this.editedPassager = null;
  }

  public savePassager(): void {
    if (!this.editedPassager) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.apiService.updatePassager(this.editedPassager.id, this.editedPassager).subscribe({
      next: () => {
        this.isSaving = false;
        this.closePanel();
        this.loadPassagers();
      },
      error: (error) => {
        console.error('Erreur modification passager', error);
        this.errorMessage = 'La modification du passager a échoué.';
        this.isSaving = false;
      }
    });
  }

  public deletePassager(passager: PassagerResponseDTO): void {
    const fullName = `${passager.prenom ?? ''} ${passager.nom ?? ''}`.trim() || `#${passager.id}`;
    if (!window.confirm(`Supprimer définitivement le passager ${fullName} ?`)) {
      return;
    }

    this.apiService.deletePassager(passager.id).subscribe({
      next: () => this.loadPassagers(),
      error: (error) => {
        console.error('Erreur suppression passager', error);
        this.errorMessage = 'Suppression impossible. Ce passager possède peut-être des courses liées.';
      }
    });
  }
}
