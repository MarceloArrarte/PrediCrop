import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getPrediction(data: any) {
    return new Promise((resolve, reject) => {
      fetch(environment.apiUrl + '/make-prediction', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(data => {
          resolve(data);
        });
      });
    });
  }

  getForecast(data: any){
    return new Promise((resolve, reject) => {
      fetch(environment.apiUrl + '/forecast', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(data => {
          resolve(data);
        });
      });
    });
  }
}
