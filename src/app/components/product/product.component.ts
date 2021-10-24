import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Product } from 'src/app/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product!: Product;
  productId!: number;
  isLoading!: boolean;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.apiService.getProduct(this.route.snapshot.params.productId)
      .subscribe((product) => {
        this.product = product;
        this.isLoading = false;
      })
  }

}
