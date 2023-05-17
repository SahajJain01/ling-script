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
    this.prompts = this.shuffle(this.prompts);
    this.getPrompt();
  }
  // getPrompt() {
  //   this.http.get<Prompt>(`${environment.apiUrl}/prompt/${this.langId}/${this.promptIndex}`).subscribe( data => {
  //     this.prompt = data.content;
  //     this.answer = data.answer;
  //   });
  // }
  prompts: Prompt[] = [
    { content: "여자", answer: "yeoja"},
    { content: "저는", answer: "joneun"},
    { content: "남자", answer: "namja"},
    { content: "당신은", answer: "dangsineun"},
    { content: "소녀", answer: "sonyeo"},
    { content: "그녀는", answer: "geunyeoneun"},
    { content: "입니다", answer: "imnida"},
    { content: "이십오", answer: "isibo"},
    { content: "스물다섯", answer: "seumuldaseot"},
    { content: "나는", answer: "naneun"},
    { content: "살입니다", answer: "sarimnida"},
    { content: "십이", answer: "sibi"},
    { content: "열둘", answer: "yeoldul"},
    { content: "십사", answer: "sipsa"},
    { content: "열넷", answer: "yeollet"},
    { content: "소녀는", answer: "sonyeoneun"},
    { content: "사십", answer: "sasip"},
    { content: "마흔", answer: "maheun"},
    { content: "미국", answer: "miguk"},
    { content: "왔습니다", answer: "watseumnida"},
    { content: "독일", answer: "dogil"},
    { content: "중국", answer: "jungguk"},
    { content: "일본", answer: "ilbon"},
    { content: "영어", answer: "yeongeo"},
    { content: "합니다", answer: "hamnida"},
    { content: "독일어", answer: "dogireo"},
    { content: "중국어", answer: "junggugeo"},
    { content: "일본어", answer: "ilboneo"},
    { content: "자다", answer: "jada"},
    { content: "잡니다", answer: "jamnida"},
    { content: "쇼핑하다", answer: "syopinghada"},
    { content: "갑니다", answer: "gamnida"},
    { content: "영화를 보다", answer: "yeonghwareul boda"},
    { content: "말하다", answer: "malhada"},
    { content: "달리다", answer: "dallida"},
    { content: "책", answer: "chaek"},
    { content: "음식", answer: "eumsik"},
    { content: "커피", answer: "keopi"},
    { content: "뜨거운", answer: "tteugeoun"},
    { content: "신문", answer: "sinmun"},
    { content: "가지고 있다", answer: "gajigo itda"},
    { content: "배우다", answer: "baeuda"},
    { content: "먹다", answer: "meokda"},
    { content: "읽다", answer: "ikda"},
    { content: "마시다", answer: "masida"},
    { content: "사다", answer: "sada"},
    { content: "밥", answer: "bap"},
    { content: "수프", answer: "supeu"},
    { content: "빵", answer: "ppang"},
    { content: "잡지", answer: "japji"},
    { content: "물", answer: "mul"}
  ]

  shuffle(array: Prompt[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
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
