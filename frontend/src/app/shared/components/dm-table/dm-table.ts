import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({ selector: 'dm-table', standalone: true, templateUrl: './dm-table.html', styleUrl: './dm-table.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmTableComponent { @Input() ariaLabel = 'Tableau de données'; @Input() compact = false; }
