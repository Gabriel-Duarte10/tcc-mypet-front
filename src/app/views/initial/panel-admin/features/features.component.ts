import { Component } from '@angular/core';
import { TableConfig } from 'src/core/components/screen-table/screen-table';
import { CharacteristicDTO, CharacteristicsService } from './characteristics.service';
export interface TableElement {
  id: number;
  nome: string;
  descricao: string;
}
@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {
  tableConfig!: TableConfig<CharacteristicDTO>;

  constructor(private service: CharacteristicsService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => {
      this.tableConfig = {
        title: 'Caracteristicas',
        titleButton: 'Nova Caracteristica',
        headers: ['Id', 'Name'],
        columnKeys: ['id', 'name'],
        items: data,
        rotaAdd: '/initial/panel-admin/features/add',
        rotaEdit: '/initial/panel-admin/features/edit'
      };
    });
  }
}
