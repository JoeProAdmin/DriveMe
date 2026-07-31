import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  constructor(public readonly apiService: ApiService) {}
  @Input() mode: 'public' | 'auth' | 'app' = 'public';
  @Input() currentLang = 'FR';
  @Input() userLabel = '';
  @Output() languageChange = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
}
