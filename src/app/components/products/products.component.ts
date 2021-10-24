import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Product } from 'src/app/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products!: Product[];
  pageIndex = 1;
  startIndex = 0;
  endIndex = 10;
  sortType = 'null';
  totalPages!: number;
  searchedKey: string = '';
  allChecked = false;
  indeterminate = true;
  checkOptionsOne: any[] = [];
  checkedCategories!: any[];
  isFiltered = false;
  isAvailable = false;
  isLoading!: boolean;
  rangeValue = [0, 1000];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.isLoading = true;
    this.apiService.getProducts().subscribe((res) => {
      res.forEach((product) => {
        if (this.checkOptionsOne.findIndex(checkOption => checkOption.label === product.category) === -1) {
          const checkOption = {
            label: product.category,
            value: product.category,
            checked: false,
          }
          this.checkOptionsOne.push(checkOption);
        }
      });

      this.checkedCategories = [];
      this.checkOptionsOne.forEach(option => {
        if (option.checked) {
          this.checkedCategories.push(option.label);
        }
      })

      let result;
      if (this.isFiltered) {
        if (this.isAvailable) {
          result = res
            .filter(product => product.price >= this.rangeValue[0] && product.price <= this.rangeValue[1])
            .filter(product => product.rating.count > 0)
            .filter(product => this.checkedCategories.includes(product.category))
            .filter(product => product.title.includes(this.searchedKey));
        } else {
          result = res
            .filter(product => product.price >= this.rangeValue[0] && product.price <= this.rangeValue[1])
            .filter(product => this.checkedCategories.includes(product.category))
            .filter(product => product.title.includes(this.searchedKey));
        }
      } else {
        if (this.isAvailable) {
          result = res
            .filter(product => product.price >= this.rangeValue[0] && product.price <= this.rangeValue[1])
            .filter(product => product.rating.count > 0)
            .filter(product => product.title.includes(this.searchedKey));
        } else {
          result = res
            .filter(product => product.price >= this.rangeValue[0] && product.price <= this.rangeValue[1])
            .filter(product => product.title.includes(this.searchedKey));
        }
      }

      this.totalPages = result.length;

      switch (this.sortType) {
        case 'null':
          this.products = result.slice(this.startIndex, this.endIndex);
          break;
        case 'ascending':
          this.products = result.sort((a, b) => { return a.price - b.price }).slice(this.startIndex, this.endIndex);
          break;
        case 'descending':
          this.products = result.sort((a, b) => { return b.price - a.price }).slice(this.startIndex, this.endIndex);
          break;
        default:
          break;
      }

      this.isLoading = false;

    })
  }

  changePageIndex(event: any) {
    this.pageIndex = event;
    this.startIndex = (event - 1) * 10;
    this.endIndex = event * 10;

    this.getProducts();
  }

  changeSort(sortType: string) {
    this.sortType = sortType;
    this.getProducts();
  }

  updateAllChecked(): void {
    this.searchedKey = '';
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
    this.getProducts();
  }

  updateSingleChecked(): void {
    this.searchedKey = '';
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.getProducts();
  }

  onAfterChange(value: any): void {
    this.rangeValue = value;

    this.getProducts();
  }

}

