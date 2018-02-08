import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SumaryDayService } from '../services/sumary-day.service';
import { ISumaryDay } from '../models/sumaryday';
import { OnChanges } from '@angular/core';
import { IConceptoDiario } from '../models/concepto.diario';

@Component({
  selector: 'app-sumarydia',
  templateUrl: './sumarydia.component.html',
  styleUrls: ['../shared/styles/sumary.css']
})
export class SumarydiaComponent implements OnInit {
  @Input() fecha: Date;
  @Input() conceptosDiarios: IConceptoDiario[];

  constructor() { 
  }

  ngOnInit() {
    
  }

  getIngresos() {
    var ingresos: number = this.conceptosDiarios.filter(x => x.importe > 0)
                              .map(c => c.importe)
                              .reduce((sum, current) => sum + current);
    return Math.abs(ingresos);                              
  }

  getEgresos() {
    var egresos: number = this.conceptosDiarios.filter(x => x.importe < 0)
                              .map(c => c.importe)
                              .reduce((sum, current) => sum + current);
    return Math.abs(egresos);
  }
}
