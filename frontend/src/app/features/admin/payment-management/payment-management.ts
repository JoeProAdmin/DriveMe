import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, PaiementResponseDTO, TransactionPortefeuilleDTO } from '../../../core/api.service';

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-management.html',
  styleUrls: ['./payment-management.css']
})
export class PaymentManagementComponent implements OnInit {
  public paiements: PaiementResponseDTO[] = [];
  public searchTerm = '';
  public statusFilter = 'TOUS';
  public isLoading = false;
  public errorMessage = '';
  public recharges: TransactionPortefeuilleDTO[] = [];
  public rechargeMessage = '';

  constructor(
    public apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPaiements();
    this.loadRecharges();
  }

  public loadRecharges(): void {
    this.apiService.getRechargesEnAttente().subscribe({next: rows => {this.recharges=rows;this.cdr.markForCheck();}, error: () => this.errorMessage='Impossible de charger les recharges.'});
  }

  public traiterRecharge(id:number, approuver:boolean): void {
    this.apiService.traiterRecharge(id, approuver).subscribe({next: () => {this.rechargeMessage=approuver?'Recharge validée.':'Recharge refusée.';this.loadRecharges();}, error: err => this.errorMessage=err?.error?.message || 'Traitement impossible.'});
  }

  public loadPaiements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getAllPaiements(true)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.paiements = (Array.isArray(data) ? [...data] : []).sort((a, b) =>
            new Date(b.datePaiement || 0).getTime() - new Date(a.datePaiement || 0).getTime()
          );
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erreur chargement paiements', error);
          this.paiements = [];
          this.errorMessage = 'Impossible de charger l’historique des paiements.';
          this.cdr.markForCheck();
        }
      });
  }

  public get filteredPaiements(): PaiementResponseDTO[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.paiements.filter((paiement) => {
      const matchesStatus = this.statusFilter === 'TOUS' || paiement.statut === this.statusFilter;
      const matchesSearch = !term || [paiement.id, paiement.courseId, paiement.montant, paiement.methode, paiement.statut]
        .some((value) => String(value ?? '').toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }

  public get totalEncaisse(): number {
    return this.paiements
      .filter((p) => ['PAYE', 'VALIDE', 'ACCEPTE'].includes((p.statut || '').toUpperCase()))
      .reduce((sum, p) => sum + Number(p.montant || 0), 0);
  }

  public get paiementsValides(): number {
    return this.paiements.filter((p) => ['PAYE', 'VALIDE', 'ACCEPTE'].includes((p.statut || '').toUpperCase())).length;
  }

  public get paiementsRefuses(): number {
    return this.paiements.filter((p) => (p.statut || '').toUpperCase() === 'REFUSE').length;
  }

  public formatStatus(statut: string): string {
    return (statut || 'INCONNU').replaceAll('_', ' ');
  }
}
