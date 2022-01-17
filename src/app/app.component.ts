import {Component, OnInit} from '@angular/core';
import {UsernameToken} from "./authorization/authorization.component";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'ShopUI';

    constructor(private httpClient: HttpClient) {
    }

    ngOnInit(): void {
        // this.httpClient.get<string>('http://localhost:8080/shop/validateToken',
        //     {headers: UsernameToken.headerWithToken()})
        //     .subscribe(res => {
        //         if (res) {
        //             this.headerSetting(true);
        //             console.log(true)
        //         }
        //         else {
        //             this.headerSetting(false);
        //             console.log(false)
        //         }
        //     }, () => {
        //         this.headerSetting(false);
        //         console.log(false)
        //     });
    }

    headerSetting(isAuthorized: boolean) {
        // @ts-ignore
        document.getElementById(`header${
            isAuthorized ? '' : '-not'
        }-logged`).classList.remove('d-none');
        // @ts-ignore
        document.getElementById(`header${
            isAuthorized ? '-not' : ''
        }-logged`).classList.add('d-none');
    }

}
