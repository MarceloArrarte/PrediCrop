import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import { BaseType, ZoomBehavior } from 'd3';

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



  @ViewChild('chart', { static: true }) chartContainer: ElementRef | undefined;
  @ViewChild('precipitationChart', { static: true }) precipitationContainer: ElementRef | undefined;
  @ViewChild('temperatureChart', { static: true }) temperatureContainer: ElementRef | undefined;


  private formattedData: { date: Date, value: number }[] = [];

  constructor(private router: Router, private apiService: ApiService) { }

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
      /*
      console.log('Sending prediction:', this.selectedCrops, this.selectedDays);
      let data = {
        crops: this.selectedCrops,
        days: this.selectedDays
      };
      this.apiService.getPrediction(data).then((response) => {
        console.log('Prediction response:', response);
      });
      */
      //this.router.navigate(['/priceTrends']);
      this.renderMainChart()
      this.renderPrecipitationChart()
      this.renderTemperatureChart()
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
  predictions = [
    978.9837646484375,
    966.9900512695312,
    978.172119140625,
    978.9837646484375,
    966.8010864257812,
    956.9705200195312,
    978.9837646484375,
    966.9900512695312,
    978.9837646484375,
    973.30712890625,
    978.9837646484375,
    966.8010864257812,
    956.9705200195312,
    956.9705200195312,
    956.9705200195312,
    966.9900512695312,
    966.9900512695312,
    966.8010864257812,
    978.9837646484375,
    978.9837646484375,
    978.172119140625,
    966.9900512695312,
    966.9900512695312,
    966.9900512695312,
    956.9705200195312,
    966.9900512695312,
    978.9837646484375,
    978.9837646484375,
    966.9900512695312,
    966.9900512695312,
    978.9837646484375,
    966.9900512695312,
    978.9837646484375,
    978.9837646484375,
    979.053466796875,
    966.9900512695312,
    966.8010864257812,
    978.9837646484375,
    978.9837646484375,
    966.9900512695312,
    978.9837646484375,
    966.9900512695312,
    978.9837646484375,
    978.9837646484375,
    973.30712890625,
    966.9900512695312,
    966.9900512695312,
    966.9900512695312,
    978.9837646484375,
    956.9705200195312,
    978.9837646484375,
    978.9837646484375,
    966.9900512695312,
    966.9900512695312,
    978.9837646484375,
    978.9837646484375,
    956.9705200195312,
    966.9900512695312,
    966.9900512695312,
    966.9900512695312,
    966.8010864257812,
    966.9900512695312,
    966.9900512695312,
    978.9837646484375,
    966.9900512695312,
    966.9900512695312,
    979.053466796875,
    978.9837646484375,
    966.9900512695312,
    978.172119140625,
    966.9900512695312,
    978.172119140625,
    956.9705200195312,
    966.9900512695312,
    956.9705200195312,
    966.9900512695312,
    978.9837646484375,
    978.9837646484375,
    973.30712890625,
    966.8010864257812,
    973.30712890625,
    970.6570434570312,
    978.9837646484375,
    956.9705200195312,
    966.9900512695312,
    979.053466796875,
    978.9837646484375,
    966.9900512695312,
    973.30712890625,
    978.9837646484375,
    966.9900512695312,
    978.9837646484375,
    978.9837646484375,
    978.9837646484375,
    978.9837646484375,
    978.9837646484375,
    966.9900512695312,
    966.9900512695312,
    956.9705200195312,
    966.9900512695312,
    978.9837646484375,
    966.9900512695312,
    966.9900512695312
  ];

  forecast = {
    precipitation: {
      "77": 1.17013127915561,
      "78": 6.00787015957758,
      "79": 1.63880109600723,
      "80": 0.910342574119568,
      "81": 11.458530575037,
      "82": 0.0,
      "83": 0.722214162349701,
      "84": 6.98053057491779,
      "85": 0.904207296669483,
      "86": 1.85810767114162
    }, temp: {
      "77": 57.2417576599122,
      "78": 46.169305305481,
      "79": 47.3183198738099,
      "80": 52.329298286438,
      "81": 51.0187477874756,
      "82": 49.704742603302,
      "83": 55.3994216728211,
      "84": 53.6133245277405,
      "85": 60.5031890678406,
      "86": 52.1265009689334
    }
  };


  renderMainChart() {
    const dates = Array.from({ length: this.predictions.length }, (_, i) =>
      new Date(Date.now() + i * 24 * 60 * 60 * 1000)
    );

    const minPrediction = Math.min(...this.predictions);
    const maxPrediction = Math.max(...this.predictions);

    const chart = Plot.plot({
      marks: [
        Plot.areaY(
          dates.map((date, i) => ({ date, value: this.predictions[i] })),
          {
            x: 'date',
            y: 'value',
            fill: 'steelblue',
            fillOpacity: 0.3,
            curve: 'catmull-rom',
          }
        ),
        Plot.dot(
          dates.map((date, i) => ({ date, value: this.predictions[i] })),
          {
            x: 'date',
            y: 'value',
            fill: 'red',
            r: 4,
            title: (d) => `Value: ${d.value.toFixed(2)}`,
          }
        )
      ],
      x: {
        label: 'Date',
        grid: true,
      },
      y: {
        label: 'Predicted Value',
        grid: true,
        domain: [minPrediction - 10, maxPrediction + 10],
      },
      style: {
        fontFamily: 'Arial, sans-serif',
      }
    });

    if (this.chartContainer && this.chartContainer.nativeElement) {
      this.chartContainer.nativeElement.innerHTML = '';
      this.chartContainer.nativeElement.appendChild(chart);

      const svg = d3.select(this.chartContainer.nativeElement).select('svg') as d3.Selection<SVGElement, unknown, null, undefined>;

      const zoom: ZoomBehavior<SVGElement, unknown> = d3.zoom<SVGElement, unknown>()
        .scaleExtent([1, 10])
        .on("zoom", (event) => {
          svg.selectAll<SVGGElement, unknown>('g').attr("transform", event.transform);
        });

      //svg.call(zoom);
    }
  }

  renderPrecipitationChart() {
    const precipitationValues = Object.values(this.forecast.precipitation);
    const dates = Array.from({ length: precipitationValues.length }, (_, i) =>
      new Date(Date.now() + i * 24 * 60 * 60 * 1000)
    );
  
    const minPrecipitation = Math.min(...precipitationValues);
    const maxPrecipitation = Math.max(...precipitationValues);
  
    const chart = Plot.plot({
      marks: [
        // Area beneath the precipitation curve
        Plot.areaY(
          dates.map((date, i) => ({ date, value: precipitationValues[i] })),
          {
            x: 'date',
            y: 'value',
            fill: 'blue',      // Change fill color to blue
            fillOpacity: 0.35,  // Adjust opacity for better visibility
            curve: 'catmull-rom', // Smooth curve
          }
        ),Plot.line(
          dates.map((date, i) => ({ date, value: precipitationValues[i] })),
          {
            x: 'date',
            y: 'value',
            stroke: 'blue',  // Line color
            curve: 'catmull-rom', // Smooth curve
          }
        ),
        // Dots on the precipitation line
        Plot.dot(
          dates.map((date, i) => ({ date, value: precipitationValues[i] })),
          {
            x: 'date',
            y: 'value',
            fill: 'blue', // Keep the dot color blue
            r: 3,
            title: (d) => `Precipitation: ${d.value.toFixed(2)} mm`,
          }
        )
      ],
      x: {
        label: 'Date',
        grid: true,
      },
      y: {
        label: 'Precipitation (mm)',
        grid: true,
        domain: [minPrecipitation - 1, maxPrecipitation + 1],
      },
      height: 150,  // Smaller height for the secondary graph
      style: {
        fontFamily: 'Arial, sans-serif',
      }
    });
  
    if (this.precipitationContainer && this.precipitationContainer.nativeElement) {
      this.precipitationContainer.nativeElement.innerHTML = '';
      this.precipitationContainer.nativeElement.appendChild(chart);
    }
  }

  renderTemperatureChart() {
    const temperatureValues = Object.values(this.forecast.temp);
    const dates = Array.from({ length: temperatureValues.length }, (_, i) =>
      new Date(Date.now() + i * 24 * 60 * 60 * 1000)
    );

    const minTemperature = Math.min(...temperatureValues);
    const maxTemperature = Math.max(...temperatureValues);

    const chart = Plot.plot({
      marks: [
        // Area below the temperature line, bounded within the y-axis limits
        Plot.areaY(
          dates.map((date, i) => ({ date, value: temperatureValues[i] })),
          {
            x: 'date',
            y: 'value',
            fill: 'yellow',    // Fill color for the area
            fillOpacity: 0.4,  // Adjust the opacity of the fill
            curve: 'catmull-rom', // Smooth curve
            clip: true         // Ensure the fill stays within the plot's y-axis bounds
          }
        ),
        // Temperature line
        Plot.line(
          dates.map((date, i) => ({ date, value: temperatureValues[i] })),
          {
            x: 'date',
            y: 'value',
            stroke: 'orange',  // Line color
            curve: 'catmull-rom', // Smooth curve
          }
        ),
        // Dots on the temperature line
        Plot.dot(
          dates.map((date, i) => ({ date, value: temperatureValues[i] })),
          {
            x: 'date',
            y: 'value',
            fill: 'orange',
            r: 3,
            title: (d) => `Temperature: ${d.value.toFixed(2)} °F`,
          }
        )
      ],
      x: {
        label: 'Date',
        grid: true,
      },
      y: {
        label: 'Temperature (°F)',
        grid: true,
        domain: [minTemperature - 5, maxTemperature + 5], // Restrict y-axis domain
      },
      height: 150,  // Smaller height for the temperature graph
      style: {
        fontFamily: 'Arial, sans-serif',
      }
    });

    if (this.temperatureContainer && this.temperatureContainer.nativeElement) {
      this.temperatureContainer.nativeElement.innerHTML = '';
      this.temperatureContainer.nativeElement.appendChild(chart);
    }
  }


}
