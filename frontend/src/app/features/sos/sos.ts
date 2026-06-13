import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sos.html'
})
export class SosComponent {

  public sendAlert(): void {

    alert(
      'Alerte SOS envoyée. Fonctionnalité en cours d’intégration.'
    );

  }

}
