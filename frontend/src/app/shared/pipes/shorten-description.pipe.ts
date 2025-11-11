import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenDescription'
})
export class ShortenDescriptionPipe implements PipeTransform {

  transform(value: string, limit: number = 120): string {
    if (!value) return '';
    const trimmed = value.trim();
    return trimmed.length > limit ? trimmed.slice(0, limit) + '…' : trimmed;
  }

}
