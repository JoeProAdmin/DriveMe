import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  // landing.css est laissé vide comme demandé pour préserver le design en ligne
})
export class Landing {
  // État pour le QR Code inDrive style, prêt à être utilisé si tu ajoutes une modale
  public isQrModalOpen: boolean = false;

  public ouvrirPopUpQr(): void {
    this.isQrModalOpen = true;
  }

  public fermerPopUpQr(): void {
    this.isQrModalOpen = false;
  }
}
