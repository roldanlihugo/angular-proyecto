import { Component, OnInit } from '@angular/core';
import { subscribeOn } from 'rxjs';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast:any;
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public cupones : Array<any>=[];
  public load_data = true;
  public page= 1;
  public pageSize = 20;
  public filtro = '';

  public token;
  constructor(
    private _cuponService:CuponService
  ) {
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response=>{
        this.cupones = response.data;
        this.load_data = false;

      }
    )
  }

  filtrar(){
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response=>{
        this.cupones = response.data;
        this.load_data = false;

      }
    )
  }

  eliminar(id:any){
      // metodo para eliminar un cliente
      this._cuponService.eliminar_cupon_admin(id,this.token).subscribe(
        response=>{
          iziToast.show({
            title:'SUCCESS',
            titleColor:'#1DC740',
            color:'#FFF',
            class: 'text-sucess',
            position:'topRight',
            message:'Se eliminó correctamente el cliente'
          });

          $('#delete-'+id).modal('hide');
          $('.modal-backdrop'+id).removeClass('show');


          this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
            response=>{
              this.cupones = response.data;
              this.load_data = false;

            }
          )

        },
        error=>{
          console.log(error);
        }
      )

  }
}
