import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  token: string = null;
  private usuario: Usuario = {};

  constructor (private navCtrl: NavController, private http: HttpClient, private storage: Storage) {
    this.storage.create();
  }

  login (email: string, password: string) {
    const data = {email, password};
    return new Promise (resolve => {
      this.http.post(`${URL}/user/login`, data).subscribe(resp => {
        console.log(resp);
        if (resp['ok']) {
          this.saveToken(resp['token']);
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  logout() {
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', {animated: true});
  }

  registro (usuario: Usuario) {
    return new Promise (resolve => {
      this.http.post(`${URL}/user/create`, usuario).subscribe(resp => {
        console.log(resp);
        if (resp ['ok']) {
          this.saveToken(resp['token']);
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  getUsuario() {
    if (!this.usuario._id) {
      this.validaToken();
    }
    return {...this.usuario};
  }

  async saveToken (token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validaToken();
  }

  async loadToken() {
    this.token = await this.storage.get('token') || null;
  }

  async validaToken(): Promise<boolean> {
    await this.loadToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }
    return new Promise<boolean> (resolve => {
      const headers = new HttpHeaders ({
        'x-token': this.token
      });
      this.http.get(`${URL}/user/`, {headers}).subscribe(resp => {
        if (resp['ok']) {
          this.usuario = resp['usuario'];
          resolve(true);
        } else {
          this.navCtrl.navigateRoot('/login');
          resolve(false);
        }
      });
    });
  }

  updateUser (usuario: Usuario) {
    const headers = new HttpHeaders ({
      'x-token': this.token
    });
    return new Promise (resolve => {
      this.http.post(`${URL}/user/update`, usuario, {headers}).subscribe (resp => {
        if (resp['ok']) {
          this.saveToken(resp['token']);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}