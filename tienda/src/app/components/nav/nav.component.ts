import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ClienteService } from '../../services/cliente.service';

declare var $:any;
declare var jQuery:any;
declare var iziToast:any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public user : any = undefined;
  public token : any = '';
  public id : any = '';
  public user_lc : any = {};

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    if(this.token){
      this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
        response => {
          this.user = response.data;
          localStorage.setItem('user_data',JSON.stringify(this.user));
          if(localStorage.getItem('user_data')){
            this.user_lc = JSON.parse(localStorage.getItem('user_data')||'{}');
          }else{
            this.user_lc = undefined;
          }
        },
        error =>{
          console.log(error);
          this.user = undefined;
        }
      );
    }


  }

  ngOnInit(): void {
  }

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);


  }

}
