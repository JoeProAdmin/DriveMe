import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-selfie-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="selfie-container">
      <header class="selfie-header">
        <h2>Vérification d'identité par Selfie</h2>
        <p class="selfie-subtitle">Prenez une photo claire de votre visage pour valider votre compte de confiance DriveMe.</p>
      </header>

      <div class="selfie-preview-box">
        <img *ngIf="imagePreview" [src]="imagePreview" alt="Aperçu selfie" class="preview-img">
        <div *ngIf="!imagePreview" class="camera-placeholder">
          <span>Aucune image sélectionnée</span>
        </div>
      </div>

      <div class="actions-block">
        <input type="file" id="selfieFile" (change)="onFileSelected($event)" accept="image/*" class="input-hidden">
        <label for="selfieFile" class="btn-secondary-upload">Choisir une photo</label>

        <button class="btn-primary-submit" [disabled]="!selectedFile || isUploading" (click)="envoyerSelfie()">
          <span *ngIf="!isUploading">Téléverser mon selfie</span>
          <span *ngIf="isUploading">Analyse biométrique en cours...</span>
        </button>
      </div>

      <p *ngIf="uploadSuccess" class="success-text">Selfie enregistré. En attente de validation administrative.</p>
    </div>
  `,
  styles: [`
    .selfie-container { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 2rem; max-width: 440px; margin: 2rem auto; text-align: center; font-family: sans-serif; }
    .selfie-header h2 { font-size: 1.25rem; color: #0f172a; margin: 0; }
    .selfie-subtitle { font-size: 0.85rem; color: #64748b; margin: 0.35rem 0 1.5rem 0; line-height: 1.4; }
    .selfie-preview-box { width: 220px; height: 220px; border-radius: 50%; border: 3px solid #00A86B; margin: 0 auto 1.5rem auto; overflow: hidden; background-color: #f1f5f9; display: flex; align-items: center; justify-content: center; }
    .preview-img { width: 100%; height: 100%; object-fit: cover; }
    .camera-placeholder { color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
    .input-hidden { display: none; }
    .btn-secondary-upload { display: inline-block; background-color: #f1f5f9; color: #334155; padding: 0.65rem 1.25rem; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 700; cursor: pointer; margin-bottom: 1rem; }
    .btn-primary-submit { width: 100%; background-color: #00A86B; color: #ffffff; border: none; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; }
    .btn-primary-submit:disabled { background-color: #cbd5e1; cursor: not-allowed; }
    .success-text { color: #16a34a; font-size: 0.85rem; font-weight: 600; margin-top: 1rem; }
  `]
})
export class SelfieVerification {
  public selectedFile: File | null = null;
  public imagePreview: string | null = null;
  public isUploading = false;
  public uploadSuccess = false;

  constructor(private apiService: ApiService) {}

  public onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  public envoyerSelfie(): void {
    if (!this.selectedFile) return;
    this.isUploading = true;

    // Extraction de l'ID du chauffeur depuis la session locale
    const chauffeurId = parseInt(localStorage.getItem('userId') || '1', 10);

    this.apiService.uploadSelfieVerification(chauffeurId, this.selectedFile).subscribe({
      next: () => {
        this.isUploading = false;
        this.uploadSuccess = true;
      },
      error: (err) => {
        console.error(err);
        this.isUploading = false;
      }
    });
  }
}
