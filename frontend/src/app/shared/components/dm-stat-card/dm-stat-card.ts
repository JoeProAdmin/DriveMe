import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({ selector: 'dm-stat-card', standalone: true, templateUrl: './dm-stat-card.html', styleUrl: './dm-stat-card.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmStatCardComponent { @Input() label = ''; @Input() value: string | number = 0; @Input() trend = ''; @Input() tone: 'neutral' | 'success' | 'warning' | 'danger' = 'neutral'; }
