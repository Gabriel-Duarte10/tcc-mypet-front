import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { TableConfig } from './screen-table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-screen-table',
  templateUrl: './screen-table.component.html',
  styleUrls: ['./screen-table.component.scss']
})
export class ScreenTableComponent<T> implements OnChanges {
  @Input() config!: TableConfig<T>;

  dataSource!: MatTableDataSource<T>;

  @ViewChild(MatSort) sort!: MatSort;

  get displayedColumns(): string[] {
    return [...this.config.columnKeys, 'actions'];
  }

  ngOnChanges(): void {
    if (this.config) {
      this.dataSource = new MatTableDataSource(this.config.items);
    }
  }

  ngAfterViewInit(): void {
    if(this.dataSource && this.sort)
    {
      this.dataSource.sort = this.sort;
    }
  }
  getProperty(object: any, path: string): any {
    return path.split('.').reduce((obj, key) => obj && obj[key], object);
  }

}

