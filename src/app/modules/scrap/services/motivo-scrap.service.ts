import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotivoScrapDto } from '../models/motivo-scrap.model';

@Injectable({ providedIn: 'root' })
export class MotivoScrapService {
  private apiUrl = '/api/MotivosScrap'; // Ajusta el endpoint real si es diferente

  /**
   * Llama al endpoint real de motivos de scrap (PSSScraps/GetMotivos)
   */
  getMotivos(): Observable<MotivoScrapDto[]> {
    const token = 't_7vMhROOh_jmKdUdc-5mM6kuypudhev-ATNIX3fTIyk-CPpl-NDX7hftn-jMhavuTvFuido-npRL9nuX5qBJVSasw5WTM2ZPD45krAhoGMAYhF5nyTC-d6A7s0rPz9N_FGPFe35r5mUOahAchubPBOi0Ee3RLHDFRMKVa3MYiO3_RYDlgkb0u08rX-STnpt8IfxOGH1YyWiU6-XTmT1RPO3acswKXo1lt4ULEnWTKFDNHwzsTQIF-Q22u7Nz1Ct1S1BpWnO2Pw0dGmRnWuvPad13iCOM8A92G9HXKoteRhok46QNB5_yXgW9X1sj5JyjibqHfx9YGTaFhCPGlMykYc3Wj1dzyZJHiQ8bWaQRKxvoqBtGeQexelGi2u8a_xjUH89mbsu8Bz8vXKe16Q1K2S9NnAuCdRPxIpfAXlFupxIGYnBPdubXwUiskdzExjV7zrIa_ypL0QNegyJhnr4RJZOtsdsi90VnfoLC5P8VfLsuN0VAZi-hV2JMhSfSUT22B0cUIsmtPu9p3sOhf86cSVIQzpGU1I_wy9If7e77PBb7vSH9jXqo20K_xjgK0usgJf-wbqaz9tpVh2Fvkc41Xidh4ndpLYrm7OTvSnTP-4';
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-ES,es;q=0.9',
      'Authorization': `Bearer ${token}`,
      'Connection': 'keep-alive',
      'Origin': 'https://localhost:44307',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };
    return this.http.get<MotivoScrapDto[]>('http://localhost:15731/api/PSSScraps/GetMotivos', { headers });
  }
  constructor(private http: HttpClient) {}

  getMotivosScrap(): Observable<MotivoScrapDto[]> {
    return this.http.get<MotivoScrapDto[]>(`${this.apiUrl}`);
  }

  createMotivoScrap(motivo: { Descripcion: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, motivo);
  }

  updateMotivoScrap(motivo: MotivoScrapDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${motivo.Id_Motivo}`, motivo);
  }

  /**
   * Actualiza un motivo de scrap usando el endpoint real
   */
  updateMotivo(motivo: MotivoScrapDto): Observable<any> {
    const token = 't_7vMhROOh_jmKdUdc-5mM6kuypudhev-ATNIX3fTIyk-CPpl-NDX7hftn-jMhavuTvFuido-npRL9nuX5qBJVSasw5WTM2ZPD45krAhoGMAYhF5nyTC-d6A7s0rPz9N_FGPFe35r5mUOahAchubPBOi0Ee3RLHDFRMKVa3MYiO3_RYDlgkb0u08rX-STnpt8IfxOGH1YyWiU6-XTmT1RPO3acswKXo1lt4ULEnWTKFDNHwzsTQIF-Q22u7Nz1Ct1S1BpWnO2Pw0dGmRnWuvPad13iCOM8A92G9HXKoteRhok46QNB5_yXgW9X1sj5JyjibqHfx9YGTaFhCPGlMykYc3Wj1dzyZJHiQ8bWaQRKxvoqBtGeQexelGi2u8a_xjUH89mbsu8Bz8vXKe16Q1K2S9NnAuCdRPxIpfAXlFupxIGYnBPdubXwUiskdzExjV7zrIa_ypL0QNegyJhnr4RJZOtsdsi90VnfoLC5P8VfLsuN0VAZi-hV2JMhSfSUT22B0cUIsmtPu9p3sOhf86cSVIQzpGU1I_wy9If7e77PBb7vSH9jXqo20K_xjgK0usgJf-wbqaz9tpVh2Fvkc41Xidh4ndpLYrm7OTvSnTP-4';
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-ES,es;q=0.9',
      'Authorization': `Bearer ${token}`,
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Origin': 'https://localhost:44307',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };
    return this.http.put(`http://localhost:15731/api/PSSScraps/UpdateMotivo`, motivo, { headers });
  }

  /**
   * Crea un motivo de scrap usando el endpoint real
   */
  createMotivo(motivo: MotivoScrapDto): Observable<any> {
    const token = 't_7vMhROOh_jmKdUdc-5mM6kuypudhev-ATNIX3fTIyk-CPpl-NDX7hftn-jMhavuTvFuido-npRL9nuX5qBJVSasw5WTM2ZPD45krAhoGMAYhF5nyTC-d6A7s0rPz9N_FGPFe35r5mUOahAchubPBOi0Ee3RLHDFRMKVa3MYiO3_RYDlgkb0u08rX-STnpt8IfxOGH1YyWiU6-XTmT1RPO3acswKXo1lt4ULEnWTKFDNHwzsTQIF-Q22u7Nz1Ct1S1BpWnO2Pw0dGmRnWuvPad13iCOM8A92G9HXKoteRhok46QNB5_yXgW9X1sj5JyjibqHfx9YGTaFhCPGlMykYc3Wj1dzyZJHiQ8bWaQRKxvoqBtGeQexelGi2u8a_xjUH89mbsu8Bz8vXKe16Q1K2S9NnAuCdRPxIpfAXlFupxIGYnBPdubXwUiskdzExjV7zrIa_ypL0QNegyJhnr4RJZOtsdsi90VnfoLC5P8VfLsuN0VAZi-hV2JMhSfSUT22B0cUIsmtPu9p3sOhf86cSVIQzpGU1I_wy9If7e77PBb7vSH9jXqo20K_xjgK0usgJf-wbqaz9tpVh2Fvkc41Xidh4ndpLYrm7OTvSnTP-4';
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-ES,es;q=0.9',
      'Authorization': `Bearer ${token}`,
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Origin': 'https://localhost:44307',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };
    return this.http.post(`http://localhost:15731/api/PSSScraps/CreateMotivo`, motivo, { headers });
  }

  deleteMotivoScrap(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
