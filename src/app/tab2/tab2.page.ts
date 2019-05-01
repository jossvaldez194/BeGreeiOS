import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController, NavParams, IonInfiniteScroll } from '@ionic/angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  public url: string = "http://www.be-green.mx/";
  page = 0;
  posts = new Array;

  constructor(public httpClient: HttpClient) {
    this.getPosts();
  }

  getPosts() {
    
    var dat: { [k: string]: any } = {};
    dat.language_id = 1;
    dat.page_number = this.page;
    dat.is_feature = 0;
    dat.categories_id = null;

    this.httpClient.post(this.url + 'getAllNews', dat).subscribe((data: any) => {
      this.infinite.complete();
      console.log(data);
      if (this.page == 0) {
        this.posts = []; !this.infinite.disabled;
      }
      if (data.success == 1) {
        this.page++;
        data.news_data.forEach((value, index) => {
          this.posts.push(value);
        });
      }
      if (data.news_data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled

        this.infinite.disabled;//disabling infinite scroll
        if (this.posts.length != 0) {
          //this.toast.show('All Posts Loaded!', 'short', 'bottom');
          console.log("Elementos cargados");
        }
      }
    }, function (response) {
      console.log("Error while loading posts from the server");
      console.log(response);
    });
  }
}
