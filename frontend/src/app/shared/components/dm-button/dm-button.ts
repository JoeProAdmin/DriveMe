import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type DmButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
export type DmButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'dm-button',
  standalone: true,
  templateUrl: './dm-button.html',
  styleUrl: './dm-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DmButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: DmButtonVariant = 'primary';
  @Input() size: DmButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;
  @Output() pressed = new EventEmitter<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.pressed.emit(event);
  }
}
