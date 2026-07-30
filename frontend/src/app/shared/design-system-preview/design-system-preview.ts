import { Component } from '@angular/core';
import { DmBadgeComponent, DmButtonComponent, DmCardComponent, DmEmptyStateComponent, DmInputComponent, DmLoaderComponent, DmSearchComponent, DmStatCardComponent, DmTableComponent } from '../components';
@Component({
  selector: 'app-design-system-preview', standalone: true,
  imports: [DmBadgeComponent, DmButtonComponent, DmCardComponent, DmEmptyStateComponent, DmInputComponent, DmLoaderComponent, DmSearchComponent, DmStatCardComponent, DmTableComponent],
  templateUrl: './design-system-preview.html', styleUrl: './design-system-preview.scss'
})
export class DesignSystemPreviewComponent { search = ''; }
