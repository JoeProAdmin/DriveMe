import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  ApiService,
  PaiementResponseDTO
} from '../../../core/api.service';

@Component({
  selector: 'app-my-payments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-payments.html',
  styleUrls: ['./my-payments.css']
})
export class MyPaymentsComponent implements OnInit {

  public paiements: PaiementResponseDTO[] = [];
  public isLoading = false;
  public errorMessage = '';

  public readonly texts = {
    fr: {
      title: 'Mes paiements',
      subtitle: 'Consultez l’historique des paiements de vos courses DriveMe.',
      refresh: 'Actualiser',
      loading: 'Chargement...',
      total: 'Total paiements',
      paid: 'Paiements effectués',
      amount: 'Montant total',
      trip: 'Course',
      method: 'Méthode',
      status: 'Statut',
      date: 'Date',
      empty: 'Aucun paiement enregistré pour le moment.',
      error: 'Impossible de charger vos paiements.',
      back: 'Retour au tableau de bord'
    },

    en: {
      title: 'My Payments',
      subtitle: 'View the payment history for your DriveMe rides.',
      refresh: 'Refresh',
      loading: 'Loading...',
      total: 'Total payments',
      paid: 'Paid',
      amount: 'Total amount',
      trip: 'Ride',
      method: 'Method',
      status: 'Status',
      date: 'Date',
      empty: 'No payments recorded yet.',
      error: 'Unable to load your payments.',
      back: 'Back to dashboard'
    },

    ar: {
      title: 'مدفوعاتي',
      subtitle: 'اطلع على سجل مدفوعات رحلاتك في DriveMe.',
      refresh: 'تحديث',
      loading: 'جاري التحميل...',
      total: 'إجمالي المدفوعات',
      paid: 'المدفوعات المنجزة',
      amount: 'المبلغ الإجمالي',
      trip: 'الرحلة',
      method: 'طريقة الدفع',
      status: 'الحالة',
      date: 'التاريخ',
      empty: 'لا توجد مدفوعات مسجلة حالياً.',
      error: 'تعذر تحميل مدفوعاتك.',
      back: 'العودة إلى لوحة التحكم'
    },

    es: {
      title: 'Mis Pagos',
      subtitle: 'Consulta el historial de pagos de tus viajes DriveMe.',
      refresh: 'Actualizar',
      loading: 'Cargando...',
      total: 'Total pagos',
      paid: 'Pagados',
      amount: 'Importe total',
      trip: 'Viaje',
      method: 'Método',
      status: 'Estado',
      date: 'Fecha',
      empty: 'Todavía no hay pagos registrados.',
      error: 'No se pueden cargar tus pagos.',
      back: 'Volver al panel'
    }
  };

  constructor(
    public apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public get currentLang(): 'fr' | 'en' | 'ar' | 'es' {
    return this.apiService.currentLanguage();
  }

  ngOnInit(): void {
    this.loadPaiements();
  }

  public loadPaiements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getMesPaiements()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.paiements = (Array.isArray(data) ? [...data] : [])
            .sort(
              (a, b) =>
                new Date(b.datePaiement || 0).getTime() -
                new Date(a.datePaiement || 0).getTime()
            );

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Erreur chargement paiements passager', error);
          this.paiements = [];
          this.errorMessage = this.texts[this.currentLang].error;
          this.cdr.markForCheck();
        }
      });
  }

  public get totalMontant(): number {
    return this.paiements
      .filter(p => this.isPaid(p.statut))
      .reduce(
        (sum, paiement) => sum + Number(paiement.montant || 0),
        0
      );
  }

  public get totalPayes(): number {
    return this.paiements.filter(p => this.isPaid(p.statut)).length;
  }

  public formatStatus(statut: string): string {
    return (statut || 'INCONNU').replaceAll('_', ' ');
  }

  public isPaid(statut: string): boolean {
    return ['PAYE', 'VALIDE', 'ACCEPTE']
      .includes((statut || '').toUpperCase());
  }
}
