import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { MenurestaurantProvider } from "../../providers/index.service";
import { GeneralMenuPage } from "../index.pages";

@Component({
  selector: "page-categories",
  templateUrl: "categories.html"
})
export class CategoriesPage {
  //itemMenu: any;
  categories: any;
  categoriesFiltered: any;
  loading: number = 1;
  error: number = 0;

  pagination: number = 0;
  currentCategory: any;
  CategoryNavigation: any;
  ListMenu = <any>{};
  DataQr: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private Menu: MenurestaurantProvider
  ) {
    this.DataQr = navParams.get("DataQr");
    this.CategoryNavigation = [];
  }

  ionViewDidEnter() {
    //CICLO DE VIDA IONIC
    this.LoadMenu();
  }
  ionViewDidLeave(){
    this.categories = [];
    this.ListMenu = {};
    this.loading = 1;
    this.CategoryNavigation = [];
    this.pagination = 0;
  }
  

  LoadMenu() {
    /*********************************************
     * OBTENER MENUS-GROUP DEL RESTAURANTE
     ********************************************/
    this.loading = 1;
    this.Menu.ListMenu(this.DataQr.sit_id)
      .then(data => {
        this.ListMenu = data;

        this.Menu.GetMenuGroup(this.ListMenu.id)
          .then(data => {
            this.loading = 0;
            this.categories = data;/* 
            this.categories = this.categories.filter(res => res.sub_category === null); */
            this.categories = this.categories.filter( res => {
              if(!res.sub_category){
                res.sub_categories = this.categories.filter(sub => sub.sub_category == res.id )
                return res
              }
            })
          })
          .catch(error => {
            this.loading = 0;
            if ((error.detail = error)) {
              this.error = 2;
            } else {
              this.error = 1;
            }
          });
      })
      .catch(error => {
        console.log("error");
        // this.loading = 0;
        // this.error = 1;
      });

    /*  this.loading = 1;
    this.Menu.GetMenuGroup(this.itemMenu.id)
      .then(data => {
        this.loading = 0;
        this.categories = data;
      })
      .catch(error => {
        this.loading = 0;
        if ((error.detail = error)) {
          this.error = 2;
        } else {
          this.error = 1;
        }
      });*/

    /*********************************************
     *                FIN
     ********************************************/
  }



  /*********************************************
   * ABRIR MENU SEGUN EL MENU-GROUP SELECCIONADO
   ********************************************/
  OpenDishes(category) {
    this.categories = [];
    this.pagination = this.pagination + 1;
    if (category.sub_category === null){
      this.loading = 1;
      this.CategoryNavigation.push({name: category.name, id: category.menu});
      this.currentCategory = this.CategoryNavigation[this.CategoryNavigation.length - 1];
      this.LoadSubCategory(category);
    }else{
      this.navCtrl.push(GeneralMenuPage, {
        category: category,
        resto: this.ListMenu.restaurant,
        sit_id: this.DataQr.sit_id
      });
    }
  }
  /*********************************************
   *                  FIN
   ********************************************/

  PopCategory() {
    this.categories = [];
    if(this.pagination === 1){
      this.LoadMenu();
      this.pagination = 0;
    }

    if(this.pagination >= 1){
      this.CategoryNavigation.pop();
      this.LoadSubCategory(this.currentCategory.id);
      this.currentCategory = this.CategoryNavigation[this.CategoryNavigation.length - 1];;
      this.pagination = this.pagination - 1;
    }
  }


  LoadSubCategory(category) {
    this.categories = category.sub_categories;
    this.loading = 0;
    /* this.Menu.GetMenuGroup(category)
    .then(data => {
      this.loading = 0;
      this.categories = data;
    })
    .catch(error => {
      this.loading = 0;
      if ((error.detail = error)) {
        this.error = 2;
      } else {
        this.error = 1;
      }
    }); */
  }
}
