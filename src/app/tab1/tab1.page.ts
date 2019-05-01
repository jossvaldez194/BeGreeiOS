import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public url: string = "http://www.be-green.mx/";
  public categories = new Array();
  public subCategories = new Array();
  public products = new Array();

  constructor(public httpClient: HttpClient, public loadingController: LoadingController,) {
    this.httpClient.post(this.url + 'allCategories', { language_id: 1 }).subscribe((data: any) => {
      for (let value of data.data) {
        if (value.parent_id == 0) {
          this.categories.push(value);
        } else {
          this.subCategories.push(value);
        }
      }
    });
  }

  getProducts(id: number) {



    this.loadingController.create({
      spinner: "bubbles",
      message: 'Cargando productos...'
    }).then((res) => {
      res.present();

      for (var i = 0; i < this.subCategories.length; i++) {
        var dat: { [k: string]: any } = {};
        dat.page_number = 0;
        dat.language_id = 1;
        dat.categories_id = this.subCategories[i].id;
        dat.type = 'a to z';

        this.httpClient.post(this.url + 'getAllProducts', dat).subscribe((data: any) => {
          console.log(data);
          this.products.push(data);
          if (i === this.subCategories.length) {
            this.hideLoader();
          }


        });
      }
      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed!');
      });
    });
  }

  hideLoader() {
    this.loadingController.dismiss();
    console.log("Salio: " + this.products.length);
  }

}
