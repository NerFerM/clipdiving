import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})

export class UsuarioGuard implements CanLoad {

  constructor( private usuarioService: UsuarioService ) {}

  canLoad(): boolean | Observable<boolean> | Promise<boolean> {
    return this.usuarioService.validaToken();
  }


}