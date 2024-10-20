import { Component, ElementRef, HostListener, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import { BaseType, ZoomBehavior } from 'd3';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  selectedCrops: string[] = [];
  selectedDays: number | null = null;
  predictions = [];
  loading = false;


  forecast = {
    precipitation: {}, temp: {}
  };

  displayColBtns = "block"
  displayBackBtn = "none"
  displayCharts = "block"

  // Charts heigth
  chartFirstHeight = 600
  chartSecondHeight = 300
  chartThirdHeight = 300

  // Charts width
  chartFistWidth = 500
  chartSecondWidth = 400
  chartThirdWidth = 400

  // For modal
  @ViewChild(ModalComponent) modal!: ModalComponent;

  launchModal(opcion: number) {
    switch (opcion) {
      case 0:
        this.modal.open(
          'SUCCESS',
          '../../assets/check.png',
          'Successful operation'
        );
        break;

      case 1:
        this.modal.open(
          'ERROR',
          '../../assets/error.png',
          'An error has occurred. Contact support for more information.'
        );
        break;

      case 2:
        this.modal.open(
          'WARNING',
          '../../assets/warning.png',
          'You have to select at least one crop and a number of days'
        );
        break;

      default:
        break;
    }
  }

  @ViewChild('chart', { static: true }) chartContainer: ElementRef | undefined;
  @ViewChild('precipitationChart', { static: true }) precipitationContainer: ElementRef | undefined;
  @ViewChild('temperatureChart', { static: true }) temperatureContainer: ElementRef | undefined;
  @ViewChild('chartsContainer') chartsContainer!: ElementRef;






  private formattedData: { date: Date, value: number }[] = [];

  constructor(private cdr: ChangeDetectorRef, private router: Router, private apiService: ApiService, private renderer: Renderer2) { }

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


  less1200 = false

  @HostListener('window:resize', ['$event'])
  onResize() {
    const htmlElement = document.documentElement;
    if (window.innerWidth <= 1200 && (this.chartContainer && this.precipitationContainer && this.temperatureContainer)) {
      this.less1200 = true

      this.renderer.removeClass(this.chartsContainer.nativeElement, 'grid1');
      this.renderer.removeClass(this.chartContainer.nativeElement, 'first1');
      this.renderer.removeClass(this.precipitationContainer.nativeElement, 'second1');
      this.renderer.removeClass(this.temperatureContainer.nativeElement, 'third1');

      this.renderer.addClass(this.chartsContainer.nativeElement, 'grid2');
      this.renderer.addClass(this.chartContainer.nativeElement, 'first2');
      this.renderer.addClass(this.precipitationContainer.nativeElement, 'second2');
      this.renderer.addClass(this.temperatureContainer.nativeElement, 'third2');

      this.chartFirstHeight = 500
      this.chartSecondHeight = 500
      this.chartThirdHeight = 500

      this.chartFistWidth = 1500
      this.chartSecondWidth = 1500
      this.chartThirdWidth = 1500

      this.renderMainChart()
      this.renderPrecipitationChart()
      this.renderTemperatureChart()
    } else {
      if (this.less1200 && (this.chartContainer && this.precipitationContainer && this.temperatureContainer)) {
        this.less1200 = false
        this.renderer.addClass(this.chartsContainer.nativeElement, 'grid1');
        this.renderer.addClass(this.chartContainer.nativeElement, 'first1');
        this.renderer.addClass(this.precipitationContainer.nativeElement, 'second1');
        this.renderer.addClass(this.temperatureContainer.nativeElement, 'third1');

        this.renderer.removeClass(this.chartsContainer.nativeElement, 'grid2');
        this.renderer.removeClass(this.chartContainer.nativeElement, 'first2');
        this.renderer.removeClass(this.precipitationContainer.nativeElement, 'second2');
        this.renderer.removeClass(this.temperatureContainer.nativeElement, 'third2');


        if (this.selectedDays && this.selectedDays <= 60) {
          this.chartFirstHeight = 500
          this.chartSecondHeight = 250
          this.chartThirdHeight = 250

          this.chartFistWidth = 900
          this.chartSecondWidth = 900
          this.chartThirdWidth = 900
        } else {
          this.chartFirstHeight = 500
          this.chartSecondHeight = 500
          this.chartThirdHeight = 500
    
          this.chartFistWidth = 1500
          this.chartSecondWidth = 1500
          this.chartThirdWidth = 1500
        }


        this.renderMainChart()
        this.renderPrecipitationChart()
        this.renderTemperatureChart()

      }
    }
  }

  sendPrediction() {
    try {


      if (this.selectedCrops.length > 0 && this.selectedDays) {

        let data = {
          crops: this.selectedCrops,
          days: this.selectedDays
        };
        this.apiService.getPrediction(data).then((response: any) => {
          if (response && response.predictions) {
            this.predictions = response.predictions;

            // Ahora hacemos la petición del pronostico del tiempo
            this.apiService.getForecast(data).then((response: any) => {

              if (response && response.forecast) {

                this.forecast.precipitation = response.forecast.precipitation
                this.forecast.temp = response.forecast.temp

                this.displayColBtns = "none"
                this.displayBackBtn = "block"
                this.displayCharts = "grid"


                if (this.selectedDays != null && this.selectedDays < 90) {
                  if (this.chartContainer != undefined && this.precipitationContainer != undefined && this.temperatureContainer != undefined) {
                    this.renderer.addClass(this.chartsContainer.nativeElement, 'grid1');
                    this.renderer.addClass(this.chartContainer.nativeElement, 'first1');
                    this.renderer.addClass(this.precipitationContainer.nativeElement, 'second1');
                    this.renderer.addClass(this.temperatureContainer.nativeElement, 'third1');

                    this.chartFirstHeight = 500
                    this.chartSecondHeight = 250
                    this.chartThirdHeight = 250

                    this.chartFistWidth = 900
                    this.chartSecondWidth = 900
                    this.chartThirdWidth = 900

                  }

                } else {
                  if (this.chartContainer != undefined && this.precipitationContainer != undefined && this.temperatureContainer != undefined) {

                    this.renderer.addClass(this.chartsContainer.nativeElement, 'grid2');
                    this.renderer.addClass(this.chartContainer.nativeElement, 'first2');
                    this.renderer.addClass(this.precipitationContainer.nativeElement, 'second2');
                    this.renderer.addClass(this.temperatureContainer.nativeElement, 'third2');

                    this.chartFirstHeight = 500
                    this.chartSecondHeight = 500
                    this.chartThirdHeight = 500

                    this.chartFistWidth = 1500
                    this.chartSecondWidth = 1500
                    this.chartThirdWidth = 1500
                  }
                }

                this.renderMainChart()
                this.renderPrecipitationChart()
                this.renderTemperatureChart()
              } else {
                console.error("Falta el pronostico")
                this.launchModal(1)
              }
            })


          } else {
            console.error('Predictions not found in response.');
            this.launchModal(1)
          }
        });

        //this.router.navigate(['/priceTrends']);

      } else {
        console.log('Please select at least one crop and a prediction time');
        this.launchModal(2)
      }

    } catch (error) {

    }
  }

  viewButtons() {
    this.displayColBtns = "block"
    this.displayBackBtn = "none"
    this.displayCharts = "none"
    if (this.chartContainer != undefined && this.precipitationContainer != undefined && this.temperatureContainer != undefined) {

      this.renderer.removeClass(this.chartsContainer.nativeElement, 'grid1');
      this.renderer.removeClass(this.chartContainer.nativeElement, 'first1');
      this.renderer.removeClass(this.precipitationContainer.nativeElement, 'second1');
      this.renderer.removeClass(this.temperatureContainer.nativeElement, 'third1');

      this.renderer.removeClass(this.chartsContainer.nativeElement, 'grid2');
      this.renderer.removeClass(this.chartContainer.nativeElement, 'first2');
      this.renderer.removeClass(this.precipitationContainer.nativeElement, 'second2');
      this.renderer.removeClass(this.temperatureContainer.nativeElement, 'third2');
    }
  }







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
            fill: 'green',
            fillOpacity: 0.3,
            curve: 'catmull-rom',
          }
        ),
        Plot.dot(
          dates.map((date, i) => ({ date, value: this.predictions[i] })),
          {
            x: 'date',
            y: 'value',
            fill: 'green',
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
      height: this.chartFirstHeight,
      width: this.chartFistWidth,
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
    const precipitationValues: number[] = Object.values(this.forecast.precipitation);
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
        ), Plot.line(
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
      height: this.chartSecondHeight,
      width: this.chartSecondWidth,
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
    const temperatureValues: number[] = Object.values(this.forecast.temp);
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
            fill: 'red',    // Fill color for the area
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
            stroke: 'red',  // Line color
            curve: 'catmull-rom', // Smooth curve
          }
        ),
        // Dots on the temperature line
        Plot.dot(
          dates.map((date, i) => ({ date, value: temperatureValues[i] })),
          {
            x: 'date',
            y: 'value',
            fill: 'red',
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
      height: this.chartThirdHeight, // Smaller height for the temperature graph
      width: this.chartThirdWidth, // Smaller height for the temperature graph
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
