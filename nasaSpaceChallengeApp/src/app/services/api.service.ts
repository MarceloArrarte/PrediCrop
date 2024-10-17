import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getPrediction(data: any) {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5000/predict', {
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
