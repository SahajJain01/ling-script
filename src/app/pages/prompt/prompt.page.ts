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
  getPrompt() {
    this.http.get<Prompt>(`${environment.apiUrl}/prompt/${this.langId}/${this.promptIndex}`).subscribe( data => {
      this.prompt = data.content;
      this.answer = data.answer;
    });
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
