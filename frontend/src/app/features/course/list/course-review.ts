import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, AvisDTO } from '../../../core/api.service';

type ReviewLanguage = 'fr' | 'en' | 'ar' | 'es';

@Component({
  selector: 'app-course-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="review-box"
      [attr.dir]="apiService.isRtlMode() ? 'rtl' : 'ltr'"
    >
      <h4>{{ text.title }}</h4>
      <p class="review-subtitle">{{ text.subtitle }}</p>

      <div class="stars-row" role="radiogroup" [attr.aria-label]="text.ratingLabel">
        <button
          *ngFor="let star of stars"
          type="button"
          role="radio"
          [attr.aria-checked]="star === reviewModel.note"
          [attr.aria-label]="star + ' / 5'"
          [class.active]="star <= reviewModel.note"
          [disabled]="isSubmitting || isSent"
          (click)="setRating(star)"
        >
          ★
        </button>
      </div>

      <textarea
        [(ngModel)]="reviewModel.commentaire"
        [placeholder]="text.placeholder"
        [disabled]="isSubmitting || isSent"
        maxlength="500"
        rows="4"
      ></textarea>

      <button
        type="button"
        class="btn-send-review"
        [disabled]="reviewModel.note === 0 || isSubmitting || isSent"
        (click)="submitReview()"
      >
        {{ isSubmitting ? text.sending : text.submit }}
      </button>

      <p *ngIf="errorMessage" class="review-alert error" role="alert">
        {{ errorMessage }}
      </p>
      <p *ngIf="isSent" class="review-alert success" role="status">
        {{ text.success }}
      </p>
    </section>
  `,
  styles: [`
    :host { display: block; margin: 0 18px 18px; }
    .review-box { border: 1px solid #d7e4db; border-radius: 12px; padding: 18px; background: #f7fcf9; }
    h4 { margin: 0; color: #0f172a; font-size: 1.05rem; }
    .review-subtitle { margin: 6px 0 14px; color: #64748b; font-size: .84rem; line-height: 1.45; }
    .stars-row { display: flex; gap: 4px; margin-bottom: 12px; }
    [dir='rtl'] .stars-row { flex-direction: row-reverse; justify-content: flex-end; }
    .stars-row button { border: 0; padding: 2px; background: transparent; color: #cbd5e1; font-size: 1.9rem; cursor: pointer; }
    .stars-row button.active { color: #f4b400; }
    textarea { width: 100%; min-height: 88px; resize: vertical; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; background: #fff; color: #172033; }
    textarea:focus { outline: none; border-color: #03ad4d; box-shadow: 0 0 0 3px rgba(3,173,77,.12); }
    .btn-send-review { width: 100%; min-height: 42px; margin-top: 12px; border: 0; border-radius: 9px; background: #03ad4d; color: #fff; font-weight: 700; cursor: pointer; }
    button:disabled, textarea:disabled { opacity: .62; cursor: not-allowed; }
    .review-alert { margin: 12px 0 0; border-radius: 8px; padding: 10px 12px; font-size: .85rem; font-weight: 600; }
    .success { background: #e5f8ec; color: #087c39; }
    .error { background: #ffe8e8; color: #a52b2b; }
  `]
})
export class CourseReview {
  @Input({ required: true }) public courseId!: number;
  @Output() public readonly reviewSubmitted = new EventEmitter<number>();

  public readonly stars = [1, 2, 3, 4, 5];
  public reviewModel: AvisDTO = { courseId: 0, note: 0, commentaire: '' };
  public isSubmitting = false;
  public isSent = false;
  public errorMessage = '';

  private readonly translations = {
    fr: { title: 'Évaluer votre trajet', subtitle: 'Votre avis contribue à la qualité et à la sécurité de la communauté DriveMe.', ratingLabel: 'Note du trajet', placeholder: 'Votre commentaire sur le conducteur ou le véhicule…', submit: 'Envoyer mon avis', sending: 'Envoi en cours…', success: 'Merci, votre avis a bien été enregistré.', error: "Impossible d'envoyer votre avis." },
    en: { title: 'Rate your ride', subtitle: 'Your feedback helps maintain quality and safety across the DriveMe community.', ratingLabel: 'Ride rating', placeholder: 'Your feedback about the driver or vehicle…', submit: 'Submit my review', sending: 'Submitting…', success: 'Thank you, your review has been saved.', error: 'Unable to submit your review.' },
    ar: { title: 'قيّم رحلتك', subtitle: 'يساعد رأيك في الحفاظ على الجودة والأمان داخل مجتمع DriveMe.', ratingLabel: 'تقييم الرحلة', placeholder: 'اكتب رأيك حول السائق أو المركبة…', submit: 'إرسال التقييم', sending: 'جارٍ الإرسال…', success: 'شكرًا، تم تسجيل تقييمك بنجاح.', error: 'تعذر إرسال تقييمك.' },
    es: { title: 'Valora tu viaje', subtitle: 'Tu opinión ayuda a mantener la calidad y la seguridad de la comunidad DriveMe.', ratingLabel: 'Valoración del viaje', placeholder: 'Tu comentario sobre el conductor o el vehículo…', submit: 'Enviar mi valoración', sending: 'Enviando…', success: 'Gracias, tu valoración se ha guardado.', error: 'No se pudo enviar tu valoración.' }
  } as const;

  constructor(
    public readonly apiService: ApiService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public get text() {
    return this.translations[this.apiService.currentLanguage() as ReviewLanguage];
  }

  public setRating(rating: number): void {
    if (!this.isSubmitting && !this.isSent) {
      this.reviewModel.note = rating;
    }
  }

  public submitReview(): void {
    if (!this.courseId || this.reviewModel.note < 1 || this.isSubmitting || this.isSent) {
      return;
    }

    const payload: AvisDTO = {
      courseId: Number(this.courseId),
      note: this.reviewModel.note,
      commentaire: this.reviewModel.commentaire.trim()
    };

    this.isSubmitting = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    this.apiService.soumettreAvis(payload)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.isSent = true;
          this.reviewSubmitted.emit(Number(this.courseId));
          this.changeDetectorRef.markForCheck();
        },
        error: err => {
          console.error('Erreur envoi avis', err);
          this.errorMessage = err?.error?.message || this.text.error;
          this.changeDetectorRef.markForCheck();
        }
      });
  }
}
