import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-price-trends',
  standalone: true,
  imports: [],
  templateUrl: './price-trends.component.html',
  styleUrl: './price-trends.component.css'
})
export class PriceTrendsComponent {

  constructor(private apiService: ApiService, private router: Router) { }

  textBox1: string = 'La tecnología ha transformado profundamente la forma en que vivimos, trabajamos y nos comunicamos. Desde el auge de los dispositivos móviles hasta el desarrollo de inteligencia artificial, estamos rodeados de innovaciones que mejoran nuestra eficiencia y conectividad. Sin embargo, también plantea desafíos, como la privacidad de los datos y el impacto en el empleo. A medida que avanzamos hacia un futuro más digital, es esencial encontrar un equilibrio entre el progreso tecnológico y el bienestar humano. La educación y la adaptabilidad serán clave para enfrentar estos cambios y aprovechar al máximo las oportunidades que nos brinda la tecnología.';

  textBox2: string = 'La tecnología ha transformado profundamente la forma en que vivimos, trabajamos y nos comunicamos. Desde el auge de los dispositivos móviles hasta el desarrollo de inteligencia artificial, estamos rodeados de innovaciones que mejoran nuestra eficiencia y conectividad. Sin embargo, también plantea desafíos, como la privacidad de los datos y el impacto en el empleo. A medida que avanzamos hacia un futuro más digital, es esencial encontrar un equilibrio entre el progreso tecnológico y el bienestar humano. La educación y la adaptabilidad serán clave para enfrentar estos cambios y aprovechar al máximo las oportunidades que nos brinda la tecnología.';

  textBox3: string = 'La tecnología ha transformado profundamente la forma en que vivimos, trabajamos y nos comunicamos. Desde el auge de los dispositivos móviles hasta el desarrollo de inteligencia artificial, estamos rodeados de innovaciones que mejoran nuestra eficiencia y conectividad. Sin embargo, también plantea desafíos, como la privacidad de los datos y el impacto en el empleo. A medida que avanzamos hacia un futuro más digital, es esencial encontrar un equilibrio entre el progreso tecnológico y el bienestar humano. La educación y la adaptabilidad serán clave para enfrentar estos cambios y aprovechar al máximo las oportunidades que nos brinda la tecnología.';


  viewFinalRecomendation() {
    console.log('Viewing final recomendation');
    this.router.navigate(['/finalRecomendation']);
  }
}
