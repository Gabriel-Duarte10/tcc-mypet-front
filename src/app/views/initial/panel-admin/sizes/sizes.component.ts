// sizes.component.ts
import { Component, OnInit } from '@angular/core';
import { TableConfig } from 'src/core/components/screen-table/screen-table';
import { SizeDTO, SizesService } from './sizes.service';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {
  tableConfig!: TableConfig<SizeDTO>;

  constructor(private service: SizesService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => {
      this.tableConfig = {
        title: 'Tamanhos',
        titleButton: 'Novo Tamanho',
        headers: ['Id', 'Name'],
        columnKeys: ['id', 'name'],
        items: data,
        rotaAdd: '/sizes/add',
        rotaEdit: '/sizes/edit'
      };
    });
  }
}
