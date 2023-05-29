import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { IonicModule } from '@ionic/angular';

type Lang = { id: number; name: string };

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, HttpClientModule],
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  langs: Lang[] = [];
  constructor(private http: HttpClient) {
      this.http
        .get<Lang[]>(`${environment.apiUrl}/langs`)
        .subscribe((data) => {
          this.langs = data;
        });
  }
}
