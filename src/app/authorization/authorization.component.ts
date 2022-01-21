import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {UserData} from "../profile/profile.component";
import {ShopList} from "../shoplist/shoplist.component";

export class UsernameToken {

    private static USERNAME_KEY: string = 'ls-username';
    private static TOKEN_KEY: string = 'ls-token';

    public static username(): string {
        return '' + localStorage.getItem(UsernameToken.USERNAME_KEY);
    }

    public static token(): string {
        return '' + localStorage.getItem(UsernameToken.TOKEN_KEY);
    }

    public static setUsername(username: string): void {
        localStorage.setItem(this.USERNAME_KEY, username);
    }

    public static setToken(username: string): void {
        localStorage.setItem(this.TOKEN_KEY, username);
    }

    public static headerWithToken(): HttpHeaders {
        return new HttpHeaders().set('Authorization', `Bearer_${UsernameToken.token()}`);
    }

    public static toAuth(): any { return ['/authorization'] }
}

export class AuthenticationRequestDto {
    constructor(
        public username: string,
        public password: string
    ) {
    }
}

export class RegistrationRequestDto {
    constructor(
        public username: string,
        public password: string,
        public firstname: string,
        public lastname: string,
        public dateOfBirth: Date
    ) {
    }
}

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.component.html',
    styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        ShopList.clearShopList();
        UsernameToken.setToken('');
        UsernameToken.setUsername('');
    }


    selectPage(className: string): void {
        document.getElementsByName('auth-page').forEach(elem => {
            if (elem.classList.contains(className)) {
                elem.classList.remove('d-none');
            } else elem.classList.add('d-none');
        })
    }

    setUsername(username: string): void {
        UsernameToken.setUsername(username);
    }

    setToken(token: string): void {
        UsernameToken.setToken(token);
    }

    submitAuth(): void {
        let authDto: AuthenticationRequestDto = new AuthenticationRequestDto(   // @ts-ignore
            ('' + document.getElementById('login-auth').value).trim(), // @ts-ignore
            ('' + document.getElementById('password-auth').value).trim()
        );
        let checkRes: string = '';
        switch ('') {
            case authDto.username: {
                checkRes = 'логин';
                break;
            }
            case authDto.password:
                checkRes = 'пароль';
        }
        if (checkRes != '') {
            alert(`При авторизации необходимо указать ${checkRes}`);
            return;
        }

        this.httpClient.post<{ username: string, token: string }>
        ('http://localhost:8080/auth/login', authDto)
            .subscribe(result => {
                if (result == null) {
                    alert('Неверный логин или пароль');
                    return;
                }
                this.goToProfile(result);
            });
    }

    submitReg(): void {
        let regDto: RegistrationRequestDto = new RegistrationRequestDto(// @ts-ignore
            ('' + document.getElementById('login-reg').value).trim(),  // @ts-ignore
            ('' + document.getElementById('password-reg').value).trim(),  // @ts-ignore
            ('' + document.getElementById('firstname-reg').value).trim(),  // @ts-ignore
            ('' + document.getElementById('lastname-reg').value).trim(),  // @ts-ignore
            document.getElementById('date-of-birth-reg').value
        );
        let checkRes: string = '';
        switch ('') {
            case regDto.username: {
                checkRes = 'логин';
                break;
            }
            case regDto.password: {
                checkRes = 'пароль';
                break;
            }
            case regDto.firstname: {
                checkRes = 'имя';
                break;
            }
            case regDto.lastname: {
                checkRes = 'фамилию';
                break;
            }
            case ('' + regDto.dateOfBirth):
                checkRes = 'дату рождения';
        }
        if (checkRes != '') {
            alert(`При регистрации необходимо указать ${checkRes}`);
            return;
        }

        console.log(regDto)

        this.httpClient.post<{ username: string, token: string }>
        ('http://localhost:8080/auth/register', regDto)
            .subscribe(result => {
                if (result == null) {
                    alert('Пользователь с таким логином уже существует');
                } else this.goToProfile(result);
            });
    }

    goToProfile(result: { username: string, token: string }): void {
        this.setUsername(result.username);
        this.setToken(result.token);
        this.router.navigate(['/profile']).then();
    }
}

