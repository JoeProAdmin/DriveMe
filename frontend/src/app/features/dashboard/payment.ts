import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, TransactionPortefeuilleDTO } from '../../core/api.service';

type PaymentMethod = 'CARTE' | 'ONLINE' | 'WAFACASH' | 'WESTERN_UNION' | 'VIREMENT';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html'
})
export class PaymentComponent implements OnInit {
  public readonly apiService = inject(ApiService);

  public readonly texts: Record<'fr' | 'en' | 'ar' | 'es', any> = {
    fr: { title:'Paiements et recharges DriveMe', subtitle:'Gestion des recharges chauffeurs, paiements clients et moyens de paiement locaux.', recharge:'Recharge chauffeur', rechargeDesc:'Les chauffeurs achètent des crédits DriveMe pour recevoir et gérer des courses.', initial:'Pack Initial', eco:'Pack Éco', pro:'Pack Pro', credits:'crédits', included:'crédits inclus', method:'Moyen de paiement', cash:'Cash client', cardName:'Nom du titulaire', cashInfo:'Le passager peut payer le chauffeur en espèces. DriveMe ne prélève pas directement le cash client : le revenu principal de la plateforme provient des recharges prépayées des chauffeurs.', walletInfo:'Simulation de paiement local : CIH Pay, Wafacash, agence partenaire, recharge télécom ou portefeuille mobile.', processing:'Traitement en cours...', validate:'Valider la recharge', business:'Modèle économique DriveMe', selected:'Pack sélectionné', paid:'Montant payé', driverCredits:'Crédits chauffeur', businessDesc:'Le chauffeur recharge son compte DriveMe. À chaque course, une partie du crédit peut être consommée selon la politique commerciale de la plateforme.', revenue:'Sources de revenus prévues', prepaid:'Recharges chauffeurs prépayées', commission:'Commissions par course', premium:'Options premium chauffeurs', partners:'Partenariats locaux', local:'Recharges locales : CIH, Wafacash, télécoms' },
    en: { title:'DriveMe payments and top-ups', subtitle:'Manage driver top-ups, customer payments and local payment methods.', recharge:'Driver top-up', rechargeDesc:'Drivers buy DriveMe credits to receive and manage trips.', initial:'Starter Pack', eco:'Eco Pack', pro:'Pro Pack', credits:'credits', included:'credits included', method:'Payment method', cash:'Customer cash', cardName:'Cardholder name', cashInfo:'The passenger can pay the driver in cash. DriveMe does not directly collect customer cash: the platform’s main revenue comes from prepaid driver top-ups.', walletInfo:'Local payment simulation: CIH Pay, Wafacash, partner agency, telecom top-up or mobile wallet.', processing:'Processing...', validate:'Confirm top-up', business:'DriveMe business model', selected:'Selected pack', paid:'Amount paid', driverCredits:'Driver credits', businessDesc:'The driver tops up their DriveMe account. Credits may be consumed on each trip according to the platform’s commercial policy.', revenue:'Planned revenue sources', prepaid:'Prepaid driver top-ups', commission:'Per-trip commissions', premium:'Premium driver options', partners:'Local partnerships', local:'Local top-ups: CIH, Wafacash, telecoms' },
    ar: { title:'مدفوعات وشحن DriveMe', subtitle:'إدارة شحن السائقين ومدفوعات العملاء ووسائل الدفع المحلية.', recharge:'شحن رصيد السائق', rechargeDesc:'يشتري السائقون رصيد DriveMe لاستقبال الرحلات وإدارتها.', initial:'الباقة الأولية', eco:'الباقة الاقتصادية', pro:'الباقة الاحترافية', credits:'رصيد', included:'رصيد متضمن', method:'طريقة الدفع', cash:'نقداً من العميل', cardName:'اسم حامل البطاقة', cashInfo:'يمكن للراكب الدفع للسائق نقداً. لا تجمع DriveMe أموال العميل مباشرة، ويأتي دخل المنصة الرئيسي من شحنات السائقين المدفوعة مسبقاً.', walletInfo:'محاكاة دفع محلي: CIH Pay أو Wafacash أو وكالة شريكة أو شحن اتصالات أو محفظة هاتفية.', processing:'جارٍ المعالجة...', validate:'تأكيد الشحن', business:'نموذج أعمال DriveMe', selected:'الباقة المختارة', paid:'المبلغ المدفوع', driverCredits:'رصيد السائق', businessDesc:'يشحن السائق حساب DriveMe الخاص به. ويمكن استهلاك جزء من الرصيد مع كل رحلة وفق السياسة التجارية للمنصة.', revenue:'مصادر الدخل المخطط لها', prepaid:'شحنات السائقين مسبقة الدفع', commission:'عمولات عن كل رحلة', premium:'خيارات مميزة للسائقين', partners:'شراكات محلية', local:'شحن محلي: CIH وWafacash والاتصالات' },
    es: { title:'Pagos y recargas DriveMe', subtitle:'Gestión de recargas de conductores, pagos de clientes y métodos de pago locales.', recharge:'Recarga del conductor', rechargeDesc:'Los conductores compran créditos DriveMe para recibir y gestionar viajes.', initial:'Pack Inicial', eco:'Pack Eco', pro:'Pack Pro', credits:'créditos', included:'créditos incluidos', method:'Método de pago', cash:'Efectivo del cliente', cardName:'Nombre del titular', cashInfo:'El pasajero puede pagar al conductor en efectivo. DriveMe no cobra directamente el efectivo del cliente: los ingresos principales proceden de recargas prepagadas de conductores.', walletInfo:'Simulación de pago local: CIH Pay, Wafacash, agencia asociada, recarga de telecomunicaciones o monedero móvil.', processing:'Procesando...', validate:'Validar recarga', business:'Modelo de negocio DriveMe', selected:'Pack seleccionado', paid:'Importe pagado', driverCredits:'Créditos del conductor', businessDesc:'El conductor recarga su cuenta DriveMe. En cada viaje se puede consumir parte del crédito según la política comercial de la plataforma.', revenue:'Fuentes de ingresos previstas', prepaid:'Recargas prepagadas de conductores', commission:'Comisiones por viaje', premium:'Opciones premium para conductores', partners:'Colaboraciones locales', local:'Recargas locales: CIH, Wafacash, telecomunicaciones' }
  };

  public get t(): any { return this.texts[this.apiService.currentLanguage()]; }
  public get selectedPackLabel(): string {
    return this.selectedPack.price === 100 ? this.t.initial : this.selectedPack.price === 500 ? this.t.pro : this.t.eco;
  }

  public selectedPack = {
    price: 250,
    credits: 275,
    label: 'Pack Éco'
  };

  public selectedMethod: PaymentMethod = 'CARTE';

  public cardName = '';
  public cardNumber = '';
  public expiry = '';
  public cvc = '';
  public isProcessing = false;
  public reference = '';
  public transactions: TransactionPortefeuilleDTO[] = [];
  public message = '';
  public error = '';
  public solde = 0;

  public ngOnInit(): void { this.loadHistory(); }

  public changePack(price: number, credits: number, label: string): void {
    this.selectedPack = { price, credits, label };
  }

  public changeMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
  }

  public executePayment(): void {
    if (this.selectedMethod === 'CARTE') {
      if (!this.cardName || !this.cardNumber || !this.expiry || !this.cvc) {
        alert('Veuillez compléter les informations de carte bancaire.');
        return;
      }
    }

    this.isProcessing = true; this.message = ''; this.error = '';
    this.apiService.demanderRecharge({montantPaye:this.selectedPack.price, credits:this.selectedPack.credits, methode:this.selectedMethod, reference:this.reference}).subscribe({
      next: tx => { this.isProcessing=false; this.message = tx.statut === 'VALIDEE' ? 'Recharge validée et crédit ajouté.' : 'Demande enregistrée. Validation administrateur en attente.'; this.cardName='';this.cardNumber='';this.expiry='';this.cvc='';this.reference='';this.loadHistory(); },
      error: err => { this.isProcessing=false; this.error=err?.error?.message || 'Impossible d’enregistrer la recharge.'; }
    });
  }

  private loadHistory(): void {
    this.apiService.getMesTransactionsPortefeuille().subscribe({next: rows => {this.transactions=rows; const last=rows.find(x=>x.soldeApres!=null); this.solde=Number(last?.soldeApres ?? 0);}});
  }
}
