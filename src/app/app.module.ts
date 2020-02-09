import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DiarioComponent } from './diario/diario.component';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MensualComponent } from './mensual/mensual.component';
import { AnualComponent } from './anual/anual.component';
import { HistoricoComponent } from './historico/historico.component';
import { ConceptosComponent } from './conceptos/conceptos.component';
import { SumarymesComponent } from './sumarymes/sumarymes.component';
import { HttpClientModule } from '@angular/common/http';
import { SumaryMonthService } from './services/sumary-month.service';
import { SumaryAnioService } from './services/sumary-anio.service';
import { SumaryHistoricoService } from './services/sumary-historico.service';
import { DiarioService } from './services/diario.service';
import { LoginModule } from './login/login.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UsersService } from './services/users.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { LOCALE_ID } from '@angular/core';
import { ConceptoService } from './services/concepto.service';
import { RegistracionComponent } from './registracion/registracion.component';
import { HelperService } from './services/helper.service';
import { UrlService } from './services/url.service';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { SumaryanioComponent } from './sumaryanio/sumaryanio.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SumaryhistoricoComponent } from './sumaryhistorico/sumaryhistorico.component';
import { HashLocationStrategy, LocationStrategy, CurrencyPipe, registerLocaleData, DatePipe } from '@angular/common';
import { IpService } from './services/ip.service';
import { MatToolbarModule, 
  MatCardModule, 
  MatButtonModule, 
  MatButtonToggleModule, 
  MatBadgeModule, 
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatExpansionModule,
  MatGridListModule,
  MatTabsModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTableModule,
  MatDatepickerModule, 
  MatTooltipModule} from  '@angular/material';
import { MatIconModule  } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { AboutComponent } from './about/about.component';
import { DiarioEnterComponent } from './diario-enter/diario-enter.component';
import { TwoDigitDecimaNumberDirective } from './directives/TwoDigitDecimaNumberDirective';
import { FormatingService } from './sharedServices/formatingService';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { SaldoComponent } from './saldo/saldo.component';
import { SaldoAbiertoComponent } from './saldo-abierto/saldo-abierto.component';
import { SaldoItemComponent } from './saldo-item/saldo-item.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ConceptoDialogComponent } from './concepto-dialog/concepto-dialog.component';
import { CalculationService } from './sharedServices/calculationService';
registerLocaleData(localeEs, localeEs); 
registerLocaleData(localeEn, localeEn); 

const routes: Routes = [    
  { path: '', component: LoginComponent},
  { path: 'registracion', component: RegistracionComponent},
  { path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthGuard],
                          children: [
                            { path: 'diario', component: DiarioComponent},
                            { path: 'mensual', component: MensualComponent },
                            { path: 'anual', component: AnualComponent },
                            { path: 'historico', component: HistoricoComponent },
                            { path: 'conceptos', component: ConceptosComponent },
                            { path: 'userprofile', component: UserprofileComponent },
                            { path: '', component: DiarioComponent },
                          ]},
  { path: '**', redirectTo: '/dashboard/diario', pathMatch: 'full'}
];  

@NgModule({
  declarations: [
    AppComponent,
    DiarioComponent,
    MensualComponent,
    AnualComponent,
    HistoricoComponent,
    ConceptosComponent,
    SumarymesComponent,
    DashboardComponent,
    RegistracionComponent,
    ErrorMessageComponent,
    SumaryanioComponent,
    UserprofileComponent,
    SumaryhistoricoComponent,
    AboutComponent,
    DiarioEnterComponent,    
    TwoDigitDecimaNumberDirective, SaldoComponent, SaldoAbiertoComponent, SaldoItemComponent, WelcomeComponent, ConceptoDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LoginModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatExpansionModule,
    MatGridListModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatListModule,
    MatRadioModule,
    MatChipsModule,
    MatTooltipModule,
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules }),
  ],
  providers: [SumaryMonthService,
              SumaryAnioService,
              SumaryHistoricoService,
              DiarioService, 
              UsersService,
              ConceptoService, 
              IpService,
              HelperService,
              FormatingService,
              CalculationService,
              UrlService,
              CurrencyPipe,
              DatePipe,
              AuthGuard,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true,
              },
              {provide: LocationStrategy, useClass: HashLocationStrategy},
              { provide: LOCALE_ID,
                useValue: window.navigator.language.split('-')[0]
              }              
            ],
  entryComponents: [ AboutComponent, DiarioEnterComponent, SaldoAbiertoComponent, WelcomeComponent, ConceptoDialogComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
