import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import Swal from 'sweetalert2';

import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root',
})
export class CargaImagenesService {
  private CARPETA_IMAGENES = 'img';

  archivosASubir: FileItem[] = [];
  archivosSubidos: any[] = [];
  archivosExisten: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  cargarImagenesFirebase(imagenes: FileItem[]) {
    // Referencia a storage de Firebase
    const storageRef = firebase.storage().ref();
    for (const item of imagenes) {
      item.estaSubiendo = true;
      if (item.progeso >= 100) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
        .put(item.archivo);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>
          (item.progeso =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        (error) => {
          console.error('Error al subir', error);
        },
        () => {
          this.archivosSubidos.push(item);
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            item.url = url;
            this.guardarImagen({
              nombre: item.nombreArchivo,
              url: item.url,
            });
            item.estaSubiendo = false;
          });
        }
      );
    }
  }

  guardarImagen(imagen: { nombre: string; url: string }) {
    this.firestore.collection(`/${this.CARPETA_IMAGENES}`).add(imagen);
    setTimeout(() => {
      this.archivosSubidos.splice(0, 1);
    }, 2000);
  }

  extraerArchivos(listaArchivos: FileItem) {
    for (const propiedad of Object.getOwnPropertyNames(listaArchivos)) {
      const archivoTemp = listaArchivos[propiedad];
      if (this.archivoPuedeCargar(archivoTemp)) {
        const nuevoArchivo = new FileItem(archivoTemp);
        this.archivosASubir.push(nuevoArchivo);
      }
    }
  }

  private archivoPuedeCargar(archivo: File): boolean {
    if (!this.archivoYaExiste(archivo.name) && this.esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private archivoYaExiste(nombreArchivo: string): boolean {
    for (const archivo of this.archivosASubir) {
      if (archivo.nombreArchivo === nombreArchivo) {
        this.archivosExisten.push(archivo.nombreArchivo);
        setTimeout(() => {
          this.archivosExisten.splice(0, 1);
        }, 2000);
        return true;
      }
    }
    return false;
  }

  private esImagen(tipoArchivo: string): boolean {
    return tipoArchivo === '' || tipoArchivo === undefined
      ? false
      : tipoArchivo.startsWith('image');
  }

  quitarItem(i: number) {
    this.archivosASubir.splice(i, 1);
  }

  limpiar() {
    this.archivosASubir = [];
  }
}
