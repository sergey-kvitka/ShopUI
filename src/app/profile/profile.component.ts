import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import * as moment from 'moment';
import 'moment/locale/ru';
import {HttpClient} from "@angular/common/http";
import {UsernameToken} from "../authorization/authorization.component";


export class UserData {

    public constructor(
        public username: string,
        public firstname: string,
        public lastname: string,
        public dateOfBirth: any,
        public role: string
    ) {
    }
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    userData: UserData = new UserData('', '', '', '', '');

    constructor(
        private router: Router,
        private httpClient: HttpClient
    ) {

    }

    ngOnInit(): void {
        this.httpClient.get<string>('http://localhost:8080/shop/validateToken',
            {headers: UsernameToken.headerWithToken()})
            .subscribe(res => {
                if (!res) {
                    this.redirect('/authorization');
                }
            }, () => {
                this.redirect('/authorization')
            });

        this.httpClient.get<UserData>('http://localhost:8080/shop/profile',
            {headers: UsernameToken.headerWithToken()}
        )
            .subscribe(
                result => {
                    if (result == null) {
                        this.redirect('/authorization');
                    } else {
                        this.userData = result;
                        result.dateOfBirth = new Date('' + result.dateOfBirth);
                    }
                },
                () => {
                    this.redirect('/authorization');
                }
            );


    }

    getUserDoB(): string {
        return moment(this.userData.dateOfBirth).format('LL');
    }

    redirect(address: string): void {
        this.router.navigate([address]).then();
    }
}
