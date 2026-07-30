import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
@Component({ selector: 'dm-input', standalone: true, templateUrl: './dm-input.html', styleUrl: './dm-input.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmInputComponent {
  @Input() id = `dm-input-${Math.random().toString(36).slice(2)}`;
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' = 'text';
  @Input() value: string | number = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() autocomplete = 'off';
  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<FocusEvent>();
  protected onInput(event: Event): void { this.valueChange.emit((event.target as HTMLInputElement).value); }
}
