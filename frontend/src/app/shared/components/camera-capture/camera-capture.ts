import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-capture.html',
  styleUrls: ['./camera-capture.css']
})
export class CameraCaptureComponent {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @Output() imageCaptured = new EventEmitter<string>();

  public async startCamera(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = stream;
    } catch (err) {
      console.error("Erreur accès caméra : ", err);
    }
  }

  public capture(): void {
    const video = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    this.imageCaptured.emit(canvas.toDataURL('image/jpeg'));
  }
}
