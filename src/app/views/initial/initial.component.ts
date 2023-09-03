import { Component } from '@angular/core';
import { SidebarItem } from 'src/core/components/sidebar/sidebar';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss']
})
export class InitialComponent {
  itens: SidebarItem[] = [
    {
      icon: 'ta-notebook',
      label: 'Meu Dashboard',
      route: '/initial/meu-dashboard',
    },
    {
      icon: 'ta-user-group',
      label: 'Análise Empresarial'  ,
      route: '/initial/analise-empresarial'
    },
    {
      icon: 'ta-user-group',
      label: 'Painel Admnistrativo'  ,
      route: '/initial/panel-admin'
    }
  ];
}
