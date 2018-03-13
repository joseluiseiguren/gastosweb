import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { NgForm } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { IpService } from '../services/ip.service';

@Component({
  selector: 'app-registracion',
  templateUrl: './registracion.component.html',
  styleUrls: ['./registracion.component.css']
})
export class RegistracionComponent implements OnInit {
  model: User = new User();
  operationMessage: string = "";
  operationMessageStatus: number = 2; /* 0 - OK / 1 - Error */
  loading: boolean = false;
  passwordCheck: string;
  fechaNacim: string;
  monedas = ['$', 'U$D', '€'];

  constructor(private _userService: UsersService,
              private _helperService: HelperService,
              private _ipService: IpService) { 
    this.model.moneda = "$";    
  }

  ngOnInit() {
  }

  aceptar(form: NgForm){
    this.loading  = true;
    
    if (this.passwordCheck != this.model.password) {
      this.operationMessageStatus = 1;
      this.operationMessage = "Los Password no coinciden";
      this.loading  = false;
      return;
    }

    this.model.fechanacimiento = new Date(
      Number(this.fechaNacim.slice(6,10)),
      Number(this.fechaNacim.slice(3,5))-1,
      Number(this.fechaNacim.slice(0,2)),
      0, 0, 0, 0);

    this._userService.register(this.model)
          .subscribe(
            data => {
              this.operationMessageStatus = 0;
              this.operationMessage = "Alta Exitosa " + this.model.nombre;
              form.resetForm();
              this.loading  = false;
            },
            error => {
              this.operationMessageStatus = 1;  
              this.loading  = false;
              this.operationMessage = this._helperService.getErrorMessage(error)
            });
  }

}
