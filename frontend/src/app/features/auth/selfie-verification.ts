import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { CameraCaptureComponent } from '../../shared/components/camera-capture/camera-capture';

@Component({
  selector: 'app-selfie-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, CameraCaptureComponent],
  template: `
    <div class="selfie-container">
      <header class="selfie-header">
        <h2>Vérification d'identité par Selfie</h2>
        <p class="selfie-subtitle">Utilisez la caméra pour capturer votre visage et valider votre compte DriveMe.</p>
      </header>

      <app-camera-capture (imageCaptured)="onImageCaptured($event)"></app-camera-capture>

      <div class="actions-block" *ngIf="imagePreview">
        <button class="btn-primary-submit" [disabled]="isUploading" (click)="envoyerSelfie()">
          <span *ngIf="!isUploading">Téléverser mon selfie</span>
          <span *ngIf="isUploading">Analyse biométrique en cours...</span>
        </button>
      </div>

      <p *ngIf="uploadSuccess" class="success-text">Selfie enregistré. En attente de validation.</p>
    </div>
  `,
  styles: [`
    .selfie-container { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 2rem; max-width: 440px; margin: 2rem auto; text-align: center; font-family: sans-serif; }
    .selfie-header h2 { font-size: 1.25rem; color: #0f172a; margin: 0; }
    .selfie-subtitle { font-size: 0.85rem; color: #64748b; margin: 0.35rem 0 1.5rem 0; line-height: 1.4; }
    .btn-primary-submit { width: 100%; background-color: #00A86B; color: #ffffff; border: none; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; margin-top: 1rem; }
    .btn-primary-submit:disabled { background-color: #cbd5e1; cursor: not-allowed; }
    .success-text { color: #16a34a; font-size: 0.85rem; font-weight: 600; margin-top: 1rem; }
  `]
})
export class SelfieVerification {
  public imagePreview: string | null = null;
  public isUploading = false;
  public uploadSuccess = false;

  constructor(private apiService: ApiService) {}

  public onImageCaptured(base64: string): void {
    this.imagePreview = base64;
  }

  public envoyerSelfie(): void {
    if (!this.imagePreview) return;
    this.isUploading = true;

    fetch(this.imagePreview)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        const chauffeurId = parseInt(localStorage.getItem('userId') || '1', 10);

        this.apiService.uploadSelfieVerification(chauffeurId, file).subscribe({
          next: () => {
            this.isUploading = false;
            this.uploadSuccess = true;
          },
          error: (err) => {
            console.error(err);
            this.isUploading = false;
          }
        });
      });
  }
}
