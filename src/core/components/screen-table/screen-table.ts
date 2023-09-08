export interface TableConfig<T> {
  title: string;
  titleButton: string;
  headers: string[];  // This represents the column titles to be displayed
  columnKeys: string[]; // This represents the actual keys in the data items
  items: T[];
  rotaAdd: string;
  rotaEdit: string;
}
