import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing {
  // État de contrôle pour l'affichage du QR Code inDrive style
  public isQrModalOpen: boolean = false;

  public ouvrirPopUpQr(): void {
    this.isQrModalOpen = true;
  }

  public fermerPopUpQr(): void {
    this.isQrModalOpen = false;
  }
}
