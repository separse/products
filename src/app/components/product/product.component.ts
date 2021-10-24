import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Product } from 'src/app/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  product!: Product;
  productId!: number;
  isLoading!: boolean;
  productSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.productSubscription = this.apiService.getProduct(this.route.snapshot.params.productId)
      .subscribe((product) => {
        this.product = product;
        this.isLoading = false;
      })
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }

}
