import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({ selector: 'dm-card', standalone: true, templateUrl: './dm-card.html', styleUrl: './dm-card.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmCardComponent {
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() elevated = false;
  @Input() interactive = false;
}
