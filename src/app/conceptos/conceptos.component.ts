import { Component, OnInit } from '@angular/core';
import { ConceptoService } from '../services/concepto.service';
import { IConcepto } from '../models/concepto';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {
  conceptos: any[];
  errorMessage: string;
  model: IConcepto = new IConcepto();
  pantallaActual: number; /* 0-ninguna / 1 - Alta / 2 - Modificacion */
  pantallaTitulo: string;
  operationMessage: string = "";
  operationMessageStatus: number = 0; /* 0 - OK / 1 - Error */
  loading: boolean = false;
  loadingGridConceptos: boolean = false;

  constructor(private _conceptoService: ConceptoService) {
    this.getConceptos();
    this.model.descripcion = "";
    this.model.id = 0;
    this.model.suma = false;
    this.pantallaActual = 0;
  }

  ngOnInit() {
  }

  changeCredDeb(value: boolean) {
    this.model.suma = value;
  }

  getConceptos() {
    this.loadingGridConceptos = true;
    this._conceptoService.getConceptos()
        .subscribe(
            data => { 
              this.conceptos = data;
              this.loadingGridConceptos = false;
            },
            error => this.errorMessage = <any>error);
  }

  cambiarPantalla(pantallaNueva: number, conceptoSeleccionado: any) {
    this.operationMessage = "";
    this.pantallaActual = pantallaNueva;
    this.model.descripcion = "";
    this.pantallaTitulo = (pantallaNueva == 1) ? "Alta de Concepto" : "Modificacion de Concepto";
    if (conceptoSeleccionado != null) {
      this.model.descripcion = conceptoSeleccionado.descripcion;
      this.model.suma = conceptoSeleccionado.credito;
      this.model.id = conceptoSeleccionado.id;
    } 
  }

  aceptar(f: NgForm): void {
    this.loading = true;
    this.model.descripcion = this.model.descripcion[0].toUpperCase() + this.model.descripcion.slice(1);

    // ALTA
    if (this.pantallaActual == 1) {
      this._conceptoService.insertConcepto(
                                      this.model.descripcion, 
                                      this.model.suma)
                  .subscribe(
                    data => {
                      f.resetForm();
                      this.operationMessage = "Carga Exitosa!";
                      this.operationMessageStatus = 0;
                      this.loading = false;
                      this.getConceptos();
                    },
                    error => {
                      this.operationMessage = (error.status == 0) ? "Se ha producido un error: " + error.message : error.error;
                      this.operationMessageStatus = 1;
                      this.loading = false;
                    });
    }
    else {
      // MODIFICACION
      this._conceptoService.updateConcepto(
                            this.model.id,
                            this.model.descripcion, 
                            this.model.suma)
                  .subscribe(
                    data => {
                      this.loading = false;
                      this.pantallaActual = 0; // cierro el form
                      this.getConceptos();
                    },
                    error => {
                      this.operationMessage = (error.status == 0) ? "Se ha producido un error: " + error.message : error.error;
                      this.operationMessageStatus = 1;
                      this.loading = false;
                    });
    }
  }
}
