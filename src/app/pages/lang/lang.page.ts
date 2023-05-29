import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { IonModal, IonicModule } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

type Lang = { name: string; units: Unit[] };
type Unit = { id: number; name: string };

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, HttpClientModule, FormsModule],
  selector: 'app-lang',
  templateUrl: 'lang.page.html',
  styleUrls: ['lang.page.scss'],
})
export class LangPage {
  @ViewChild(IonModal) modal?: IonModal;
  langName = '';
  langId = 0;
  newUnitName = '';
  units: Unit[] = [];
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.langId = Number(params['id']);
      this.getUnits();
    });
  }
  getUnits() {
    this.http
        .get<Lang>(`${environment.apiUrl}/units/${this.langId}`)
        .subscribe((data) => {
          this.langName = data.name;
          this.units = data.units;
        });
  }
  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal?.dismiss(this.newUnitName, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.http
        .post<any>(`${environment.apiUrl}/create/unit`, { langId: this.langId, name: ev.detail.data})
        .subscribe((data) => {
          console.log(data);
          this.getUnits();
        });
    }
  }
}
