import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { UrlService } from './url.service';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormGroup } from '@angular/forms';

@Injectable()
export class UsersService {
    private jwtHelper = new JwtHelperService();
    public userCurrency: string;

    public userName = new BehaviorSubject<string>('');

    constructor(private _http: HttpClient,
                private _urlService: UrlService) {
      this.setUserName(this.getUserNameFromToken());
    }

    login(email: string, password: string, location: string ): Observable<boolean> {
        return this._http.post<any>(this._urlService.urlLogin(),
                {email, password, location})
                .pipe(map(user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('alow', user.token);
                        this.userCurrency = this.getMoneda();
                        this.setUserName(this.getUserNameFromToken());
                        return true;
                    }

                    return false;
                }
                ));
    }

    register( usuario: User ): Observable<void> {
        const fechanacimiento = usuario.fechanacimiento.getFullYear().toString() +
                (usuario.fechanacimiento.getMonth() + 1).toString().padStart(2, '0') +
                usuario.fechanacimiento.getDate().toString().padStart(2, '0');

        return this._http.post<any>(this._urlService.urlRegistracion(),
                {email: usuario.email,
                 password: usuario.password,
                 nombre: usuario.nombre,
                 fechanacimiento: fechanacimiento,
                 moneda: usuario.moneda});
    }

    updateProfile(usuario: User): Observable<void> {
        const fechanacimiento = usuario.fechanacimiento.getFullYear().toString() +
                (usuario.fechanacimiento.getMonth() + 1).toString().padStart(2, '0') +
                usuario.fechanacimiento.getDate().toString().padStart(2, '0');

        return this._http.put<any>(this._urlService.urlUserUpdateProfile(),
                {email: usuario.email,
                 password: usuario.password,
                 nombre: usuario.nombre,
                 fechanacimiento: fechanacimiento,
                 moneda: usuario.moneda});
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('alow');
    }

    isSessionExpired(): boolean {
        const token = localStorage.getItem('alow');
        if (token === null) {
            return true;
        }

        if (this.jwtHelper.isTokenExpired(token) === true) {
            return true;
        }

        return false;
    }

    private getUserNameFromToken(): string {
        const token = localStorage.getItem('alow');
        let userName = '';

        if (token !== null) {
            userName = this.jwtHelper.decodeToken(token).user;
        }

        return userName;
    }

    setUserName(userName: string): void {
      this.userName.next(userName);
    }

    getUserId(): number {
        const token = localStorage.getItem('alow');
        let userId = 0;

        if (token !== null) {
            userId = this.jwtHelper.decodeToken(token).id;
        }

        return userId;
    }

    private getMoneda(): string {
        const token = localStorage.getItem('alow');
        let moneda = '';

        if (token !== null) {
            moneda = this.jwtHelper.decodeToken(token).moneda;
        }

        return moneda;
    }

    getProfile(): Observable<User> {
        return this._http.get<User>(this._urlService.urlGetUserProfile(this.getUserId()))
                        .pipe(tap(data => JSON.stringify(data)));
    }

    getAvailablesCurrencies(): string[] {
        return ['$', 'U$D', '€'];
    }

    checkPasswords(group: FormGroup) {
        const pass = group.get('passwordFormControl').value;
        const confirmPass = group.get('passwordRepeatFormControl').value;

        return pass === confirmPass ? null : { notSame: true };
      }

}
