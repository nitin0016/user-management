import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: unknown,data: any): unknown {
    console.log(data)
    let records = data.filter((student:any) =>
      student?.name.includes(value) ||
    student?.email.includes(value)
  );
    return records;
  }

}
