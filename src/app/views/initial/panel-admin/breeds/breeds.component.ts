// breeds.component.ts
import { Component, OnInit } from '@angular/core';
import { TableConfig } from 'src/core/components/screen-table/screen-table';
import { BreedDTO, BreedsService } from './breeds.service';

@Component({
  selector: 'app-breeds',
  templateUrl: './breeds.component.html',
  styleUrls: ['./breeds.component.scss']
})
export class BreedsComponent implements OnInit {
  tableConfig!: TableConfig<BreedDTO>;

  constructor(private service: BreedsService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => {
      this.tableConfig = {
        title: 'Raças',
        titleButton: 'Nova Raça',
        headers: ['Id', 'Name', 'Tipo de Animal'],
        columnKeys: ['id', 'name', 'animalType.name'],
        items: data,
        rotaAdd: '/breeds/add',
        rotaEdit: '/breeds/edit'
      };
    });
  }
}
