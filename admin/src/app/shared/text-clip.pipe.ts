import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textClip' })
export class TextClipPipe implements PipeTransform {
	transform(value: string, length: number): string {
		if (value) {
			return `${value.substring(0, length)} ...`;
		}
		return value;
	}
}
