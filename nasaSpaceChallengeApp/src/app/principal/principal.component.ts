import { Component } from '@angular/core';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  selectedCrops: string[] = [];
  selectedDays: number | null = null;

  toggleCrop(crop: string) {
    if (this.selectedCrops.includes(crop)) {
      this.selectedCrops = this.selectedCrops.filter(c => c !== crop);
    } else {
      this.selectedCrops.push(crop);
    }
  }

  selectDays(days: number) {
    this.selectedDays = days;
  }

  sendPrediction() {
    if (this.selectedCrops.length > 0 && this.selectedDays) {
      // Aquí iría la lógica para enviar la predicción
      console.log('Sending prediction:', this.selectedCrops, this.selectedDays);
    } else {
      console.log('Please select at least one crop and a prediction time');
    }
  }
  /*
  selectedCrops: string[] = [];
  selectedDays: number | null = null;
  selectedLocation: { x: number, y: number } | null = null;

  selectCrop(crop: string) {
    const index = this.selectedCrops.indexOf(crop);
    if (index > -1) {
      this.selectedCrops.splice(index, 1);
    } else {
      this.selectedCrops.push(crop);
    }
  }

  selectDays(days: number) {
    this.selectedDays = days;
  }

  selectLocation(event: MouseEvent) {
    const img = event.target as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.selectedLocation = { x, y };
  }

  isFormValid(): boolean {
    return this.selectedCrops.length > 0 && this.selectedDays !== null && this.selectedLocation !== null;
  }

  sendPrediction() {
    if (this.isFormValid()) {
      console.log('Sending prediction:', {
        crops: this.selectedCrops,
        days: this.selectedDays,
        location: this.selectedLocation
      });
    }
  }
    */
}
