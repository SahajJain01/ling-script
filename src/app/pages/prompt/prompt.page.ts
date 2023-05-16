import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { FormsModule } from '@angular/forms';

type Prompt = {content: string, answer: string};

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, FormsModule],
  selector: 'app-prompts',
  templateUrl: 'prompt.page.html',
  styleUrls: ['prompt.page.scss']
})
export class PromptPage {
  inputText = '';
  promptIndex = 1;
  prompt = '';
  answer = '';
  langId = 1;
  constructor(private http: HttpClient) {
    this.getPrompt();
  }
  // getPrompt() {
  //   this.http.get<Prompt>(`${environment.apiUrl}/prompt/${this.langId}/${this.promptIndex}`).subscribe( data => {
  //     this.prompt = data.content;
  //     this.answer = data.answer;
  //   });
  // }
  prompts: Prompt[] = [
    { content: "안녕하세요", answer: "annyeonghaseyo"},
    { content: "안녕히 가세요", answer: "annyeonghi gaseyo"},
    { content: "안녕히 계세요", answer: "annyeonghi gyeseyo"},
    { content: "네", answer: "ne"},
    { content: "예", answer: "ye"},
    { content: "괜찮다", answer: "gwaenchanhda"},
    { content: "아니요", answer: "aniyo"},
    { content: "주세요", answer: "juseyo"},
    { content: "감사합니다", answer: "gamsahamnida"},
    { content: "고마워요", answer: "gomawoyo"},
    { content: "천만에요", answer: "cheonmaneyo"},
    { content: "미안해요", answer: "mianhaeyo"},
    { content: "몰라요", answer: "mollayo"}
  ]
  getPrompt() {
    this.prompt = this.prompts[this.promptIndex-1].content;
    this.answer = this.prompts[this.promptIndex-1].answer;
  }
  isValid() {
    return this.answer.toLocaleLowerCase() == this.inputText.toLocaleLowerCase();
  }
  next() {
    this.promptIndex++;
    this.inputText = '';
    this.getPrompt();
  }
}
