import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { IonicModule, AlertController } from '@ionic/angular';

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
  constructor(private http: HttpClient, private alertController: AlertController) {
      this.http
        .get<Lang[]>(`${environment.apiUrl}/langs`)
        .subscribe({
          next: (data) => { this.langs = data; },
          error: () => this.presentError('Failed to load languages')
        });
  }

  trackByLangId(index: number, lang: Lang): number {
    return lang.id;
  }

  private async presentError(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
