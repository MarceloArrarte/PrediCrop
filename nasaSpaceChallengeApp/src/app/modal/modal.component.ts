import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('modalElement') modalElement!: ElementRef;

  title: string = ""
  imgSrc: string = ""
  content: string = ""

  private bootstrapModal!: Modal;

  ngAfterViewInit() {
    this.bootstrapModal = new Modal(this.modalElement.nativeElement);
  }

  open(title: string, imgSrc: string, content: string) {
    // Establecer los valores antes de mostrar el modal
    this.title = title;
    this.imgSrc = imgSrc;
    this.content = content;

    // Mostrar el modal
    this.bootstrapModal.show();
  }

  close() {
    this.bootstrapModal.hide();
  }
}
