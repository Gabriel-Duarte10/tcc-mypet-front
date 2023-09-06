import { Component } from '@angular/core';
import { Navbar } from 'src/core/components/navbar/navbar';

@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.scss']
})
export class PanelAdminComponent {

  navbarItens: Navbar[] = [
    { title: "Caracteristicas", route: "features" },
    { title: "Tipos de Animais", route: "animal-types" },
    { title: "Raças", route: "breeds" },
    { title: "Tamanho", route: "sizes" },
  ];
}
