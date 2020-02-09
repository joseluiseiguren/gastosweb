import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiarioService } from '../services/diario.service';
import { IConceptoDiario } from '../models/concepto.diario';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { MatDialog, MatDatepickerInputEvent, MatSnackBar } from '@angular/material';
import { DiarioEnterComponent } from '../diario-enter/diario-enter.component';
import { FormControl } from '@angular/forms';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';
import { ISaldoItem } from '../models/saldoItem';
import { DatePipe } from '@angular/common';
import { SumaryMonthService } from '../services/sumary-month.service';
import { SumaryAnioService } from '../services/sumary-anio.service';
import { forkJoin, Subscription } from 'rxjs';
import { CalculationService } from '../sharedServices/calculationService';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit, OnDestroy {
  conceptos: IConceptoDiario[];
  loading: Boolean = false;
  loadingPopup: Boolean = false;
  displayedColumns: string[] = ['descripcion', 'importe'];
  currentDate = new FormControl(new Date());  
  private getDataSubscription: Subscription;
  private summaryDialogSubscription: Subscription;
  
  constructor(private _conceptosDiarioService: DiarioService,
              private _userService: UsersService,
              private _helperService: HelperService,
              private datePipe: DatePipe,
              public snackBar: MatSnackBar,
              private _sumaryMonthService: SumaryMonthService,
              private _sumaryAnioService: SumaryAnioService,
              private calculationService: CalculationService,
              public enterDiario: MatDialog,
              public saldoAbierto: MatDialog) {  }

  ngOnInit() {
    this.getData();    
  }

  ngOnDestroy(): void {
    this.unsubscribeGetData();
    this.unsubscribeSummaryDialog();
  }

  unsubscribeGetData(): void {
    if (this.getDataSubscription){ this.getDataSubscription.unsubscribe(); }    
  }

  unsubscribeSummaryDialog(): void {
    if (this.summaryDialogSubscription){ this.summaryDialogSubscription.unsubscribe(); }    
  }

  changeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.getData();    
  }

  getData() {
    this.loading = true;
    this.unsubscribeGetData();

    this.getDataSubscription = this._conceptosDiarioService.getConceptosImportes(this.currentDate.value)
        .subscribe(
            data => { 
              this.conceptos = data;
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  openConcepto(concepto: IConceptoDiario){    
    this.enterDiario.open(DiarioEnterComponent, { data: {concepto} });    
  }
  
  getIngresos() : number {
    return this.calculationService.getIngresos(this.convertToNumberArray(this.conceptos));
  }

  getEgresos() : number {
    return this.calculationService.getEgresos(this.convertToNumberArray(this.conceptos));
  }

  private showOpenSaldo(){
    this.loadingPopup = true;
    let saldos: ISaldoItem[] = [];    
    saldos.push(new ISaldoItem("" + this._helperService.toCamelCase(this.datePipe.transform(new Date(this.currentDate.value), 'mediumDate')), "today", this.getIngresos(), this.getEgresos()));

    this.unsubscribeSummaryDialog();
    this.summaryDialogSubscription = forkJoin(this._sumaryMonthService.getSumary(this.currentDate.value), this._sumaryAnioService.getSumary(this.currentDate.value))
        .subscribe(([mensual, anual]) => {
          saldos.push(new ISaldoItem("" + this._helperService.toCamelCase(this.datePipe.transform(new Date(this.currentDate.value), 'LLLL yyyy')), "calendar_today", mensual.ingresos, mensual.egresos));          
          saldos.push(new ISaldoItem("Año " + this.datePipe.transform(new Date(this.currentDate.value), 'yyyy'), "airplay", anual.ingresos, anual.egresos));

          this.loadingPopup = false;
          this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });    
        },
        error => {
          this.loadingPopup = false;
          this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
        });
  }

  private convertToNumberArray(dataIn: IConceptoDiario[]) : number[] {
    let importes: number[] = [];
    dataIn.forEach(function (value) {
      importes.push(value.importe);
    }); 

    return importes;
  }

  
}
