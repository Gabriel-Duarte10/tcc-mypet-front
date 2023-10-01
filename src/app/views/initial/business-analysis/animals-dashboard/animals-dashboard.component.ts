import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnimalTypeDTO } from '../../panel-admin/animal-types/animal-types.service';
import { BreedDTO } from '../../panel-admin/breeds/breeds.service';
import { CharacteristicDTO } from '../../panel-admin/features/characteristics.service';
import { SizeDTO } from '../../panel-admin/sizes/sizes.service';
import { ActivatedRoute } from '@angular/router';
import { PetDto, PetsUsersService } from '../PetUser.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-animals-dashboard',
  templateUrl: './animals-dashboard.component.html',
  styleUrls: ['./animals-dashboard.component.scss']
})
export class AnimalsDashboardComponent implements OnInit {
  form!: FormGroup;
  animalTypes: AnimalTypeDTO[] = [];
  breeds: BreedDTO[] = [];
  characteristics: CharacteristicDTO[] = []; // Exemplo, ajuste conforme necessário
  sizes: SizeDTO[] = []; // Exemplo, ajuste conforme necessário
  pets: PetDto[] = []; // Exemplo, ajuste conforme necessário
  petsAll: PetDto[] = []; // Exemplo, ajuste conforme necessário
  statuses: string[] = ['Adotado', 'Disponível']; // Exemplo, ajuste conforme necessário
  listFiltros: string[] = [];  // Adicione esta linha
  states: string[] = [];
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType = 'doughnut';
  ActiveMap: number = 1;

  public barChartLabels: string[] = [];

  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData = [
    {
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Pets',
      backgroundColor: []  // Adicione esta linha
    }
  ];

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `Pets: ${value}`;
        }
      }
    }
  };

  private chart: am4charts.PieChart; // Adicione essa linha
  private barChart: am4charts.XYChart; // Adicione essa linha
  pieSeries: am4charts.PieSeries;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private yourService: PetsUsersService // Adicione esta linha
  ) { }

  ngOnInit() {
    const resolvedData = this.route.snapshot.data['dashboardData'];
    this.animalTypes = resolvedData.animalTypes;
    this.breeds = resolvedData.breeds;
    this.characteristics = resolvedData.characteristics;
    this.sizes = resolvedData.sizes;
    this.pets = resolvedData.pets;
    this.petsAll = resolvedData.pets;

    this.form = this.fb.group({
      animalType: [''],
      breed: [''],
      characteristics: [''],
      size: [''],
      status: [''],
      minAge: [''],
      maxAge: [''],
      startDate: [''], // Adicione isso
      endDate: [''], // Adicione isso,
      state: [''] // Adicione isso
    });
    this.states = [...new Set(this.petsAll.map(pet => pet.user.state))];
  }
  updateChart() {
    const filterData = this.form.value;
    let combinedData = [];

    if (!filterData.state) {
      this.barChartLabels = this.states;
      combinedData = this.states.map(state => {
        return {
          label: state,
          count: this.pets.filter(pet => pet.user.state === state).length
        };
      });
    } else {
      const cities = [...new Set(this.pets.filter(pet => pet.user.state === filterData.state).map(pet => pet.user.city))];
      combinedData = cities.map(city => {
        return {
          label: city,
          count: this.pets.filter(pet => pet.user.city === city).length
        };
      });
    }

    // Ordenar os dados com base na contagem
    combinedData.sort((a, b) => b.count - a.count);

    am4core.useTheme(am4themes_animated);

    // Destrua o gráfico anterior, se existir
    if (this.barChart) {
      this.barChart.dispose();
    }

    // Criar um novo gráfico de barras
    this.barChart = am4core.create('barchartdiv', am4charts.XYChart);
    this.barChart.data = combinedData;

    // Configurar eixos
    let categoryAxis = this.barChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'label';
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.rotation = -45;

    let valueAxis = this.barChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Quantidade';
    valueAxis.renderer.minLabelPosition = 0.1;

    // Crie e configure as séries de dados
    let barSeries = this.barChart.series.push(new am4charts.ColumnSeries());
    barSeries.dataFields.valueY = 'count';
    barSeries.dataFields.categoryX = 'label';
    barSeries.name = 'Pets';
  }


  filterPets(filters: any): PetDto[] {
    return this.petsAll.filter(pet => {
      if (filters.animalType && !this.filterByAnimalType(pet, filters.animalType)) return false;
      if (filters.breed && !this.filterByBreed(pet, filters.breed)) return false;
      if (filters.characteristics && !this.filterByCharacteristics(pet, filters.characteristics)) return false;
      if (filters.size && !this.filterBySize(pet, filters.size)) return false;
      if (filters.status && !this.filterByStatus(pet, filters.status)) return false;
      if (filters.minAge && !this.filterByMinAge(pet, filters.minAge)) return false;
      if (filters.maxAge && !this.filterByMaxAge(pet, filters.maxAge)) return false;
      if (filters.startDate && !this.filterByStartDate(pet, filters.startDate)) return false;
      if (filters.endDate && !this.filterByEndDate(pet, filters.endDate)) return false;
      if (filters.state && !this.filterByState(pet, filters.state)) return false;
      return true;
    });
  }

  private filterByAnimalType(pet: PetDto, animalType: number): boolean {
    return pet.animalTypeId === +animalType;
  }

  private filterByBreed(pet: PetDto, breed: number): boolean {
    return pet.breedId === +breed;
  }

  private filterByCharacteristics(pet: PetDto, characteristic: number): boolean {
    return pet.characteristicId === +characteristic;
  }

  private filterBySize(pet: PetDto, size: number): boolean {
    return pet.sizeId === +size;
  }

  private filterByStatus(pet: PetDto, status: string): boolean {
    return (status === 'adopted' ? pet.adoptionStatus : !pet.adoptionStatus);
  }

  private filterByMinAge(pet: PetDto, minAge: number): boolean {
    return pet.birthYear <= new Date().getFullYear() - +minAge;
  }

  private filterByMaxAge(pet: PetDto, maxAge: number): boolean {
    return pet.birthYear >= new Date().getFullYear() - +maxAge;
  }

  private filterByState(pet: PetDto, state: string): boolean {
    return pet.user.state === state;
  }

  private filterByStartDate(pet: PetDto, startDate: string): boolean {
    let start = new Date(startDate);
    let petCreatedDate = new Date(pet.createdAt);
    return petCreatedDate >= start;
  }

  private filterByEndDate(pet: PetDto, endDate: string): boolean {
    let end = new Date(endDate);
    let petCreatedDate = new Date(pet.createdAt);
    return petCreatedDate <= end;
  }



  onSubmit() {
    if (this.form.valid) {
      const filterData = this.form.value;
      this.pets = this.filterPets(filterData);

      if (!filterData.state) {
        // Estado não selecionado, use estados como eixo X
        this.barChartLabels = this.states;
        this.barChartData[0].data = this.states.map(state => {
          return this.pets.filter(pet => pet.user.state === state).length;
        });
      } else {
        // Estado selecionado, use cidades desse estado como eixo X
        const cities = [...new Set(this.pets.filter(pet => pet.user.state === filterData.state).map(pet => pet.user.city))];
        this.barChartLabels = cities;
        this.barChartData[0].data = cities.map(city => {
          return this.pets.filter(pet => pet.user.city === city).length;
        });
      }

      // Convert IDs back to their names for the list of filters
      this.listFiltros = [];
      if (filterData.animalType) {
        const animalType = this.animalTypes.find(type => type.id === +filterData.animalType);
        this.listFiltros.push(animalType ? animalType.name : '');
      }
      if (filterData.breed) {
        const breed = this.breeds.find(b => b.id === +filterData.breed);
        this.listFiltros.push(breed ? breed.name : '');
      }
      if (filterData.characteristics) {
        const characteristic = this.characteristics.find(c => c.id === +filterData.characteristics);
        this.listFiltros.push(characteristic ? characteristic.name : '');
      }
      if (filterData.size) {
        const size = this.sizes.find(s => s.id === +filterData.size);
        this.listFiltros.push(size ? size.name : '');
      }
      this.listFiltros.push(filterData.status);
      this.listFiltros.push(filterData.minAge);
      this.listFiltros.push(filterData.maxAge);
      this.listFiltros.push(filterData.startDate);
      this.listFiltros.push(filterData.endDate);
      this.listFiltros = this.listFiltros.filter(val => val);
    }
    if (this.ActiveMap == 2) {
      this.updateChart();
    } if (this.ActiveMap == 3) {
      this.updateDoughnutChart();
    }
  }

  downloadExcel() {
    const rawFilters = this.form.value;

    // Mapeando os valores do formulário para corresponder ao FilterModel
    let filters = {
      AnimalTypeId: rawFilters.animalType ? +rawFilters.animalType : null,
      BreedId: rawFilters.breed ? +rawFilters.breed : null,
      CharacteristicId: rawFilters.characteristics ? +rawFilters.characteristics : null,
      SizeId: rawFilters.size ? +rawFilters.size : null,
      MinAge: rawFilters.minAge ? +rawFilters.minAge : null,
      MaxAge: rawFilters.maxAge ? +rawFilters.maxAge : null,
      StartDate: rawFilters.startDate || null,
      EndDate: rawFilters.endDate || null,
      Status: null,  // inicialmente definido como null
      State: rawFilters.state || null
    };

    // Ajustando o Status
    if (rawFilters.status === 'adopted') {
      filters.Status = true;
    } else if (rawFilters.status === 'available') {
      filters.Status = false;
    } else {
      filters.Status = null;
    }

    this.yourService.exportToExcel(filters).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Pets.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  updateDoughnutChart() {
    // Preparar os dados com base nos filtros
    const filterData = this.form.value;
    let combinedData = [];

    if (!filterData.state) {
      this.doughnutChartLabels = this.states;
      combinedData = this.states.map(state => {
        return {
          label: state,
          count: this.pets.filter(pet => pet.user.state === state).length
        };
      });
    } else {
      const cities = [...new Set(this.pets.filter(pet => pet.user.state === filterData.state).map(pet => pet.user.city))];
      combinedData = cities.map(city => {
        return {
          label: city,
          count: this.pets.filter(pet => pet.user.city === city).length
        };
      });
    }

    // Ordenar os dados com base na contagem
    combinedData.sort((a, b) => b.count - a.count);

    // Configurar tema
    am4core.useTheme(am4themes_animated);

    // Se o gráfico já existir, destrua as séries antigas
    if (this.chart) {
      this.chart.series.each(series => series.dispose());
    } else {
      // Se o gráfico não existir, crie um novo
      this.chart = am4core.create('chartdiv', am4charts.PieChart);
    }

    // Atualizar os dados do gráfico
    this.chart.data = combinedData;

    // Criar e configurar a nova série
    this.pieSeries = this.chart.series.push(new am4charts.PieSeries());
    this.pieSeries.dataFields.value = "count";
    this.pieSeries.dataFields.category = "label";
    this.pieSeries.innerRadius = am4core.percent(50);

    this.pieSeries.labels.template.adapter.add("textOutput", function(text, target) {
      if (target.dataItem && target.dataItem.values.value["value"] == 0) {
          return "";
      }
      return text;
  });

  // Adicione um adapter para ocultar ticks com valor zero
  this.pieSeries.ticks.template.adapter.add("disabled", function(value, target) {
      if (target.dataItem && target.dataItem.values["value"]["value"] == 0) {
          return true;
      }
      return value;
  });
  }


  showMap(active: number) {
    this.ActiveMap = active;
    // Força a detecção de mudanças, se necessário
    this.cdr.detectChanges();
    if (this.ActiveMap === 3) {
      this.updateDoughnutChart();
    } else {
      this.destroyDoughnutChart();
    }
    if (this.ActiveMap === 2) {
      this.updateChart();
    } else {
      this.destroyBarChart();
    }

  }

  destroyBarChart() {
    if (this.barChart) {
      this.barChart.dispose();
      this.barChart = undefined;  // Certifique-se de redefinir barChart para undefined ou null
    }
  }


  destroyDoughnutChart() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = undefined;
    }
  }

  ngAfterViewInit() {
    if (this.ActiveMap === 3) {
      this.updateDoughnutChart();
    }
    if (this.ActiveMap === 2) {
      this.updateChart();
    }
  }

  onReset() {
    this.form.reset();
  }
}
