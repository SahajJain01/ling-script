import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IonicModule, AlertController, IonModal } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';

type Prompt = { content: string; answer: string };

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ],
  selector: 'app-unit',
  templateUrl: 'unit.page.html',
  styleUrls: ['unit.page.scss'],
})
export class UnitPage {
  @ViewChild(IonModal) modal?: IonModal;
  prompts: Prompt[] = [];
  unitId = 0;
  newPrompt: Prompt = { content: '', answer: '' };
  promptIndex = -1;
  prompt = '';
  answer = '';
  inputText = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.route.params.subscribe((params) => {
      this.unitId = Number(params['id']);
      this.getPrompts();
    });
  }

  shuffle(array: Prompt[]) {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  getPrompts() {
    this.promptIndex = -1;
    this.http
      .get<Prompt[]>(`${environment.apiUrl}/prompts/${this.unitId}`)
      .subscribe((data) => {
        this.prompts = this.shuffle(data);
        this.next();
      });
  }

  loadPrompt() {
    this.prompt = this.prompts[this.promptIndex]?.content;
    this.answer = this.prompts[this.promptIndex]?.answer;
  }

  submit() {
    if (this.isValid()) {
      this.next();
    } else {
      this.showError();
    }
  }

  async showError() {
    const alert = await this.alertController.create({
      header: 'Wrong Answer',
      message: 'Please try again!',
      buttons: ['OK'],
    });
    await alert.present();
  }

  isValid() {
    return this.answer == this.inputText;
  }

  next() {
    this.promptIndex++;
    this.inputText = '';
    this.loadPrompt();
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal?.dismiss(this.newPrompt, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<Prompt>>;
    if (ev.detail.role === 'confirm') {
      this.http
        .post<any>(`${environment.apiUrl}/create/prompt`, {
          unitId: this.unitId,
          content: ev.detail.data?.content,
          answer: ev.detail.data?.answer,
        })
        .subscribe((data) => {
          console.log(data);
          this.getPrompts();
        });
    }
    this.newPrompt.answer = '';
    this.newPrompt.content = '';
  }
}
