import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {UsernameToken} from "../authorization/authorization.component";

export class Order {
    constructor(
        public id: number,
        public userId: number,
        public orderDate: Date
    ) {
    }
}

@Component({
    selector: 'app-orderlist',
    templateUrl: './orderlist.component.html',
    styleUrls: ['./orderlist.component.css']
})
export class OrderlistComponent implements OnInit, OnChanges {

    orders: Order[] = [];

    constructor(
        private router: Router,
        private httpClient: HttpClient
    ) {
    }

    ngOnInit(): void {

        this.httpClient.get<string>('http://localhost:8080/shop/validateToken',
            {headers: UsernameToken.headerWithToken()})
            .subscribe(res => {
                if (!res) this.redirect('/authorization');
            }, () => this.redirect('/authorization'));

        this.httpClient.get<Order[]>(`http://localhost:8080/shop/orders`,
            {headers: UsernameToken.headerWithToken()})
            .subscribe(result => {
                    if (result == null) {
                        this.router.navigate(UsernameToken.toAuth()).then();
                    } else {
                        this.orders = result;
                    }
                }
            );
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit();
    }

    int(v: any): number {
        return +(v);
    }

    redirect(address: string): void {
        this.router.navigate([address]).then();
    }

    updateOrders(_: any) {
        this.ngOnInit();
    }
}
