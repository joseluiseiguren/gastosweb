import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { DiarioService } from '../services/diario.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ISaldoItem } from '../models/saldoItem';
import { DatePipe } from '@angular/common';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';
import { CalculationService } from '../sharedServices/calculationService';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anual',
  templateUrl: './anual.component.html',
  styleUrls: ['./anual.component.css']
})
export class AnualComponent implements OnInit, OnDestroy {
  anios: number[] = new Array<number>();
  anioSelected: number;
  loading: Boolean = false;
  loadingDetail: Boolean = false;
  conceptosTotales: any[];
  itemDetail: any[];
  private getPrimerConsumoSubscription: Subscription;
  private getDataSubscription: Subscription;
  private getAnioDetailSubscription: Subscription;

  constructor(private _datePipe: DatePipe,
              private _diarioService: DiarioService,
              private _userService: UsersService,
              public snackBar: MatSnackBar,
              public saldoAbierto: MatDialog,
              private calculationService: CalculationService,
              private router: Router,
              private route: ActivatedRoute,
              private _helperService: HelperService) {  
    this.anioSelected = this.getDateFromUrl().getFullYear();
  }

  ngOnInit() {
    this.getData();
    this.getPrimerConsumo();
  }

  ngOnDestroy(): void {
    this.unsubscribeGetPrimerConsumo();
    this.unsubscribeGetData();
    this.unsubscribeItemDetail();
  }

  unsubscribeGetPrimerConsumo(): void {
    if (this.getPrimerConsumoSubscription){ this.getPrimerConsumoSubscription.unsubscribe(); }    
  }

  unsubscribeGetData(): void {
    if (this.getDataSubscription){ this.getDataSubscription.unsubscribe(); }    
  }

  unsubscribeItemDetail(): void {
    if (this.getAnioDetailSubscription){ this.getAnioDetailSubscription.unsubscribe(); }    
  }

  getPrimerConsumo() {
    this.loading = true;    
    this.unsubscribeGetPrimerConsumo();
    this.getPrimerConsumoSubscription = this._diarioService.getPrimerConsumo()
        .subscribe(
            data => {
              let anioPrimerConsumo = Number(data.fechaMin.substring(0,4));
              let anioUltimoConsumo = Number(data.fechaMax.substring(0,4));

              for (let _i = anioUltimoConsumo; _i >= anioPrimerConsumo; _i--) {
                this.anios.push(_i);
              }
              this.getData();
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  getIngresos() : number {
    return this.calculationService.getIngresos(this.convertToNumberArray(this.conceptosTotales));
  }

  getEgresos() : number {
    return this.calculationService.getEgresos(this.convertToNumberArray(this.conceptosTotales));
  }

  getData() : void {
    this.loading = true;
    this.unsubscribeGetData();
    this.getDataSubscription = this._diarioService.getConceptosTotalAnio(this.anioSelected)
        .subscribe(
            data => { 
              this.conceptosTotales = data;
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  private showOpenSaldo(){
    let saldos: ISaldoItem[] = [];
    
    saldos.push(new ISaldoItem("Año" + this._helperService.toCamelCase(this._datePipe.transform(new Date(this.anioSelected, 1, 1), 'yyyy')), 
                "airplay", 
                this.getIngresos(), 
                this.getEgresos(),
                "anual",
                new Date(this.anioSelected, 1, 1)));    
    this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });    
  }

  loadYearDetails(row: any) {    
    this.loadingDetail = true;
    this.itemDetail = undefined;
    this.unsubscribeItemDetail();
    this.getAnioDetailSubscription = this._diarioService.getConceptosMovimAnio(row.idConcepto, this.anioSelected)
        .subscribe(
            data => {
              this.itemDetail = data;
              this.loadingDetail = false; 
            },
            error => {
              this.loadingDetail = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  onChangeYear (newValue) {
    this.getData();
  }

  goToMonth(value) {
    this.router.navigate(['dashboard/mensual/' + this._helperService.convertStringMMYYYYToDate(value).toISOString()]);    
  }

  private convertToNumberArray(dataIn: any[]) : number[] {
    if (dataIn !== undefined){
      let importes: number[] = [];
      dataIn.forEach(function (value) {
        importes.push(value.saldo);
      }); 

      return importes;
    }    
  }

  private getDateFromUrl() :Date {
    let dateUrl = this.route.snapshot.paramMap.get("anio");  
    if (dateUrl === 'current') {
      return new Date();
    } else {
      return new Date(dateUrl);
    }
  }
}
