import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
@Component({ selector: 'dm-search', standalone: true, templateUrl: './dm-search.html', styleUrl: './dm-search.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmSearchComponent {
  @Input() value = '';
  @Input() placeholder = 'Rechercher';
  @Input() ariaLabel = 'Rechercher';
  @Output() valueChange = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();
  protected update(event: Event): void { this.valueChange.emit((event.target as HTMLInputElement).value); }
  protected clear(): void { this.value = ''; this.valueChange.emit(''); this.cleared.emit(); }
}
