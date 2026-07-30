import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DmButtonComponent } from '../dm-button/dm-button';
@Component({ selector: 'dm-confirm-dialog', standalone: true, imports: [DmButtonComponent], templateUrl: './dm-confirm-dialog.html', styleUrl: './dm-confirm-dialog.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmConfirmDialogComponent {
  @Input() open = false; @Input() title = 'Confirmer l’action'; @Input() message = 'Voulez-vous continuer ?'; @Input() confirmLabel = 'Confirmer'; @Input() cancelLabel = 'Annuler'; @Input() destructive = false;
  @Output() confirmed = new EventEmitter<void>(); @Output() cancelled = new EventEmitter<void>();
}
