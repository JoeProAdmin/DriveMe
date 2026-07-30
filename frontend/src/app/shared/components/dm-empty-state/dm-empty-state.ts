import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({ selector: 'dm-empty-state', standalone: true, templateUrl: './dm-empty-state.html', styleUrl: './dm-empty-state.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmEmptyStateComponent { @Input() title = 'Aucun résultat'; @Input() description = 'Aucune donnée ne correspond à votre recherche.'; }
