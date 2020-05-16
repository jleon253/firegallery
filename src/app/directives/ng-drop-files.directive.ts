import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FileItem } from '../models/file-item';
import {CargaImagenesService} from '../services/carga-imagenes.service';

@Directive({
  selector: '[appNgDropFiles]',
})
export class NgDropFilesDirective {
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor( private cargaService: CargaImagenesService ) {}

  @HostListener('dragover', ['$event'])
  public dragOver(event: any) {
    this.mouseSobre.emit(true);
    this.prevenirAbrirImagen(event);
  }

  @HostListener('dragleave', ['$event'])
  public dragLeave(event: any) {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public drop(event: any) {
    const transferencia = this.getTransferencia(event);
    if (!transferencia) {
      return;
    }
    this.cargaService.extraerArchivos(transferencia.files);
    this.prevenirAbrirImagen(event);
    this.mouseSobre.emit(false);
  }

  /**
   * Me permite obtener la informacion de los archivos
   * Se extiende para compatibilidad
   * @param event: Evento generado por la accion drop
   */
  private getTransferencia(event: any) {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  // Validaciones

  private prevenirAbrirImagen(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
