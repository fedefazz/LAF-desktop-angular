import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'argentinianNumber',
  standalone: true
})
export class ArgentinianNumberPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals: number = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0,00';
    }

    try {
      // Convertir el número a string con decimales fijos
      const fixedValue = Number(value).toFixed(decimals);
      
      // Separar la parte entera de la decimal
      const [integerPart, decimalPart] = fixedValue.split('.');
      
      // Formatear la parte entera con puntos como separador de miles
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      // Combinar con coma como separador decimal
      const result = decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
      
      return result;
    } catch (error) {
      return '0,00';
    }
  }
}
