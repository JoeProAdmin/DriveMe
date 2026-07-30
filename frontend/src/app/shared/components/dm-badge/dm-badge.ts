import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
export type DmBadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
@Component({ selector: 'dm-badge', standalone: true, templateUrl: './dm-badge.html', styleUrl: './dm-badge.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmBadgeComponent { @Input() variant: DmBadgeVariant = 'neutral'; @Input() dot = false; }
