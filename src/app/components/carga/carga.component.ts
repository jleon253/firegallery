import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css'],
})
export class CargaComponent implements OnInit {

  estaSobreElemento = false;
  subiendo = false;

  constructor( public cargaService: CargaImagenesService) {}

  ngOnInit() {
    this.archivosInputFile();
  }

  subirImagenes() {
    this.cargaService.cargarImagenesFirebase(this.cargaService.archivosASubir);
  }

  archivosInputFile() {
    const inputFile = document.getElementById('inputFile');
    inputFile.addEventListener('change', (event: any) => {
      const fileList = event.target.files;
      this.cargaService.extraerArchivos(event.target.files);
    });
  }
}
