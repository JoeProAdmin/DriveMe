import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent // ✅ Ajouté ici pour corriger l'erreur NG8001 et activer la barre latérale responsiv
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // Le composant racine orchestre le Shell adaptatif (Web, Tablette, Smartphone)
}
