import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AvisDTO } from '../../../core/api.service';

@Component({
  selector: 'app-course-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="review-box" [attr.dir]="apiService.isRtlMode() ? 'rtl' : 'ltr'">
      <h4>Évaluer votre trajet sur DriveMe</h4>
      <p class="review-subtitle">Votre avis permet de maintenir la sécurité et la qualité de notre communauté de conducteurs.</p>

      <div class="stars-row">
        <button *ngFor="let star of [1,2,3,4,5]"
                type="button"
                (click)="setRating(star)"
                [class.active]="star <= reviewModel.note">
          ★
        </button>
      </div>

      <div class="textarea-block">
        <textarea [(ngModel)]="reviewModel.commentaire"
                  placeholder="Laissez un commentaire sur le comportement du conducteur ou le véhicule..."></textarea>
      </div>

      <button class="btn-send-review"
              (click)="envoyerAvis()"
              [disabled]="reviewModel.note === 0">
        Soumettre la notation
      </button>

      <p *ngIf="isSent" class="success-alert">Merci pour votre retour !</p>
    </div>
  `,
  styles: [`
    .review-box { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; max-width: 400px; width: 100%; box-sizing: border-box; }
    .review-box h4 { margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 700; }
    .review-subtitle { font-size: 0.8rem; color: #64748b; margin: 0.25rem 0 1rem 0; line-height: 1.4; }
    .stars-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .stars-row button { background: none; border: none; font-size: 1.75rem; color: #cbd5e1; cursor: pointer; transition: color 0.1s ease; }
    .stars-row button.active { color: #16a34a; }
    .textarea-block textarea { width: 100%; min-height: 80px; border: 1px solid #cbd5e1; border-radius: 0.375rem; padding: 0.5rem; font-size: 0.85rem; box-sizing: border-box; resize: none; }
    .textarea-block textarea:focus { outline: none; border-color: #16a34a; }
    .btn-send-review { width: 100%; background-color: #16a34a; color: #ffffff; border: none; padding: 0.65rem; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 700; cursor: pointer; margin-top: 0.75rem; }
    .btn-send-review:disabled { background-color: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
    .success-alert { color: #16a34a; font-size: 0.85rem; font-weight: 600; text-align: center; margin-top: 0.5rem; }
  `]
})
export class CourseReview {
  @Input() courseId!: number;

  public reviewModel: AvisDTO = {
    courseId: 0,
    note: 0,
    commentaire: ''
  };

  public isSent = false;

  constructor(public apiService: ApiService) {}

  public setRating(rating: number): void {
    this.reviewModel.note = rating;
  }

  public envoyerAvis(): void {
    this.reviewModel.courseId = this.courseId;
    this.apiService.soumettreAvis(this.reviewModel).subscribe({
      next: () => {
        this.isSent = true;
      },
      error: (err: any) => console.error('Erreur envoi avis', err)
    });
  }
}
