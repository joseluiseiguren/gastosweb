import { Component, OnInit, TemplateRef, ElementRef, ViewRef, ComponentRef, ViewContainerRef, ViewChild, ContentChild, SimpleChanges } from '@angular/core';
import { DiarioService } from '../services/diario.service';
import { IConceptoDiario } from '../models/concepto.diario';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SumaryMonth } from '../models/sumarymonth';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit {
  bsValue: Date = new Date();
  conceptos: IConceptoDiario[];
  conceptoSel: IConceptoDiario;
  nuevoImporte: number;
  nuevoDebCred: boolean;
  errorMessage: string;
  modalRef: BsModalRef;
  sumMonth: SumaryMonth = new SumaryMonth();
  
  constructor(private _conceptosDiarioService: DiarioService,
              private modalService: BsModalService) { 
    this.sumMonth.totalEgresos = 0;
    this.sumMonth.totalIngresos = 0;          
  }

  ngOnInit() {
    this.getData();
  }

  changeDay(newValue: Date) {
    if (newValue.getFullYear() != this.bsValue.getFullYear() ||
        newValue.getMonth() != this.bsValue.getMonth() ||
        newValue.getDay() != this.bsValue.getDay()){
        this.bsValue = newValue;
        this.getData();
    }
  }

  getData() {
    this._conceptosDiarioService.getConceptosImportes(this.bsValue).subscribe(
      data => this.conceptos = data,
      error => this.errorMessage = <any>error);
  }

  openModal(template: TemplateRef<any>, concepto: IConceptoDiario) {
    this.conceptoSel = concepto;
    this.nuevoImporte = Math.abs(this.conceptoSel.importe);
    this.nuevoDebCred = this.conceptoSel.concepto.suma;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm', ignoreBackdropClick: false, animated: true, keyboard: true}  );
  }
 
  confirm(): void {
    if (this.conceptoSel.concepto.suma){
      this.sumMonth.totalIngresos -= this.conceptoSel.importe;
    }
    else{
      this.sumMonth.totalEgresos -= Math.abs(this.conceptoSel.importe);
    }
    
    this.conceptoSel.importe = (this.nuevoDebCred) ? this.nuevoImporte : this.nuevoImporte*(-1);
    this.conceptoSel.concepto.suma = this.nuevoDebCred;

    if (this.conceptoSel.concepto.suma){
      this.sumMonth.totalIngresos += this.conceptoSel.importe;
    }
    else{
      this.sumMonth.totalEgresos += Math.abs(this.conceptoSel.importe);
    }

    this.modalRef.hide();
  }
 
  decline(): void {
    this.modalRef.hide();
  }

  changeNuevoDebCred(suma: boolean): void {
    this.nuevoDebCred = suma;
  }

}
