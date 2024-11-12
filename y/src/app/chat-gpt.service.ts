// chat-gpt.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatGptService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'; // OpenAI API endpoint
  private apiKey = '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'; // Replace with your OpenAI API Key

  constructor(private http: HttpClient) {}

  sendMessage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-3.5-turbo', // Specify the model you want to use
      messages: [{ role: 'user', content: prompt }],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
