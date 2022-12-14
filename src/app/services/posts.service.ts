import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { Post, RespuestaPosts } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { UiServiceService } from 'src/app/services/ui-service.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  paginaPosts = 0;
  nuevoPost = new EventEmitter<Post>();

  constructor (private http: HttpClient, private usuarioService: UsuarioService, private fileTransfer: FileTransfer, private uiService: UiServiceService) { }

  getPosts (pull: boolean = false) {
    if (pull) {
      this.paginaPosts = 0;
    }
    this.paginaPosts++;
    return this.http.get<RespuestaPosts>(`${URL}/posts/?pagina=${this.paginaPosts}`);
  }

  crearPost (post) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    return new Promise(resolve => {
      this.http.post(`${URL}/posts`, post, {headers}).subscribe(resp => {
        this.nuevoPost.emit(resp['post']);
        resolve(true);
      });
    });
  }

  subirVideo (vid: string) {
    const options: FileUploadOptions = { 
      fileKey: 'video',
      mimeType: "video/mp4",
      headers: {
        'x-token': this.usuarioService.token
      }
    };
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    fileTransfer.upload(vid, `${URL}/posts/upload`, options).then (data => {
      console.log(data);
      this.uiService.presentToast('El vídeo se ha cargado correctamente');
    }).catch(err => {
      console.log ('Error al cargar', err);
      this.uiService.presentToast('Error al cargar el vídeo');
    });
  }
}