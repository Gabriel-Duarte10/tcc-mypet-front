import { Component, OnInit } from '@angular/core';
import { TableConfig } from 'src/core/components/screen-table/screen-table';
import { AnimalTypeDTO, AnimalTypesService } from './animal-types.service';

@Component({
  selector: 'app-animal-types',
  templateUrl: './animal-types.component.html',
  styleUrls: ['./animal-types.component.scss']
})
export class AnimalTypesComponent implements OnInit {
  tableConfig!: TableConfig<AnimalTypeDTO>;

  constructor(private service: AnimalTypesService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => {
      this.tableConfig = {
        title: 'Tipos de Animais',
        titleButton: 'Novo Tipo',
        headers: ['Id', 'Name'],
        columnKeys: ['id', 'name'],
        items: data,
        rotaAdd: '/initial/panel-admin/animal-types/add',
        rotaEdit: '/initial/panel-admin/animal-types/edit'
      };
    });
  }
}
