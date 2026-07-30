import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({ selector: 'dm-loader', standalone: true, templateUrl: './dm-loader.html', styleUrl: './dm-loader.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DmLoaderComponent { @Input() label = 'Chargement en cours'; @Input() size: 'sm' | 'md' | 'lg' = 'md'; @Input() overlay = false; }
