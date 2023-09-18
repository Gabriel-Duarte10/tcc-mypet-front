import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

import { GeoDataService } from 'src/core/services/geo-data.service';
import { ChangeDetectorRef } from '@angular/core';
import { PetDto } from '../PetUser.service';

@Component({
  selector: 'app-brasil-map',
  templateUrl: './brasil-map.component.html',
  styleUrls: ['./brasil-map.component.scss']
})
export class BrasilMapComponent implements OnInit, OnDestroy, OnChanges {
  private chart!: am4maps.MapChart;
  private hitListener: any;
  private polygonSeries!: am4maps.MapPolygonSeries;
  title: string = "Mapa do Brasil";
  public mapaBrasil: any;
  public statesWithColors: { state: any, color: string, petCount: number }[] = [];
  public citiesWithColors: { city: any, color: string, petCount: number }[] = [];
  private initialStateColors: { [stateName: string]: string } = {};
  private initialCityColors: { [cityName: string]: string } = {};

  public viewingCities: boolean = false;
  @Input() petsList: PetDto[] = [];
  @Input() listFiltros: string[] = [];
  public statePetCount: { [stateName: string]: number } = {};
  public cityPetCount: { [cityName: string]: number } = {};
  private labelSeries?: am4maps.MapImageSeries;


  constructor(private zone: NgZone, private geoDataService: GeoDataService, private cdRef: ChangeDetectorRef) { }

  async ngOnInit() {
    this.initMap();
  }

  async ngOnDestroy() {
    this.disposeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['petsList'] && this.chart) {
      this.updatePetCountsAndColors();
      this.chart.invalidateData();
    }
    if (changes['listFiltros']) {
      //console.log('Filtros atualizados:', this.listFiltros);
    }
  }


  /**
   * Initialize the map with default settings
   */
  async initMap() {
    this.calculatePetsCount();
    this.zone.runOutsideAngular(async () => {
      try {
        this.chart = am4core.create("chartdiv", am4maps.MapChart);

        // Load GeoJSON for Brazil states
        this.mapaBrasil = await this.geoDataService.getGeoData('brazil-states.geojson');
        this.statesWithColors = this.mapaBrasil.features.map((feature: any) => {
          const stateName = feature.properties.sigla;
          if (!this.initialStateColors[stateName]) {
            this.initialStateColors[stateName] = this.randomColor();
          }
          return {
            state: feature,
            color: this.initialStateColors[stateName],
            petCount: this.statePetCount[stateName] || 0
          };
        });

        this.statesWithColors.sort((a, b) => b.petCount - a.petCount);
        this.cdRef.detectChanges();

        this.setupMapProperties();
        this.setupPolygonSeries();
        this.setupMapEvents();
        this.setupZoomControls();
      } catch (error) {
        console.error("Erro ao carregar os dados geográficos:", error);
        alert("Houve um problema ao carregar o mapa. Por favor, tente novamente mais tarde.");
      }
    });
  }

  /**
   * Dispose the map on component destruction
   */
  disposeMap() {
    //console.log('Disposing map...');

    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        if (this.polygonSeries && this.polygonSeries.mapPolygons && this.polygonSeries.mapPolygons.template) {
          this.polygonSeries.mapPolygons.template.events.off("hit", this.hitListener);
        }
        this.chart.dispose();
      }
    });
  }

  /**
   * Set up main properties of the map
   */
  setupMapProperties() {
    //console.log('Setting up map properties...');
    this.chart.geodata = this.mapaBrasil;
  }

  /**
   * Set up the polygon series for the map
   */
  setupPolygonSeries() {
    //console.log('Setting up polygon series...');
    // Mapeamento entre polígonos e seus rótulos
    const polygonToLabelMap: Map<am4maps.MapPolygon, am4core.Label> = new Map();

    // Configuração da série de polígonos
    this.polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
    this.polygonSeries.useGeodata = true;
    this.polygonSeries.calculateVisualCenter = true; // Habilita o cálculo do "centro visual" para cada polígono

    let polygonTemplate = this.polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";

    polygonTemplate.adapter.add("fill", (fill, target) => {
      const name = (target.dataItem.dataContext as any)?.name;
      const foundState = this.statesWithColors.find(item => item.state.properties.name === name);
      const color = foundState ? foundState.color : this.randomColor();
      (target as any).customColor = color; // Armazene a cor em uma propriedade personalizada do polígono
      return am4core.color(color);
    });


    // Configuração da série de rótulos
    this.labelSeries = this.chart.series.push(new am4maps.MapImageSeries());

    this.labelSeries.mapImages.clear();

    let labelTemplate = this.labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = "middle";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.fontSize = 15;
    labelTemplate.nonScaling = true;
    labelTemplate.interactionsEnabled = false;

    // Populando com dados
    this.polygonSeries.mapPolygons.template.events.on("validated", (event) => {

      const polygon = event.target;
      const stateName = (polygon.dataItem.dataContext as any)?.sigla;
      if (stateName) {
        const count = this.statePetCount[stateName] || 0;
        if (this.labelSeries) {
          let label = this.labelSeries.mapImages.create();
          label.latitude = polygon.visualLatitude;
          label.longitude = polygon.visualLongitude;
          const labelText = (label.children.getIndex(0) as am4core.Label);
          labelText.text = count.toString();
          // Definindo a cor do rótulo com base na cor de fundo
          const backgroundColor = (polygon as any).customColor; // Obter a cor de fundo do polígono
          labelText.fill = am4core.color(this.getLabelColor(backgroundColor));
        }

      }
    });

  }

  /**
   * Set up map events
   */
  setupMapEvents() {
    //console.log('Setting up map events...');
    this.polygonSeries.mapPolygons.template.events.on("hit", this.hitListener = async (event: any) => {

      const stateData: any = event.target.dataItem.dataContext;
      const stateCode = stateData.codigo_ibg;
      if(stateCode === '31') {
        return;
      }
      const zoomAnimation = this.chart.zoomToMapObject(event.target);
      zoomAnimation.events.on("animationended", async () => {

        if (this.labelSeries) {
          this.labelSeries.mapImages.clear();
        }
        const citiesData = await this.geoDataService.getGeoData(`geojs-${stateCode}-mun.json`);
        this.chart.geodata = citiesData;

        this.citiesWithColors = citiesData.features.map((feature: any) => {

          const cityName = feature.properties.name;
          if (!this.initialCityColors[cityName]) {
            this.initialCityColors[cityName] = this.randomColor();
          }
          return {
            city: feature,
            color: this.initialCityColors[cityName],
            petCount: this.cityPetCount[cityName] || 0
          };
        });

        this.citiesWithColors.sort((a, b) => b.petCount - a.petCount);

        let cityPolygonTemplate = this.polygonSeries.mapPolygons.template;
        cityPolygonTemplate.adapter.add("fill", (fill, target) => {
          const name = (target.dataItem.dataContext as any)?.name;
          const foundCity = this.citiesWithColors.find(item => item.city.properties.name === name);
          return am4core.color(foundCity ? foundCity.color : this.randomColor());
        });

        this.title = stateData.name;
        this.viewingCities = true;
        this.polygonSeries.mapPolygons.template.clickable = false;
        this.polygonSeries.mapPolygons.template.hoverable = false;
        this.cdRef.detectChanges();
        this.chart.invalidateData();
        this.chart.goHome(800);
      });
    });
  }

  /**
   * Set up zoom controls for the map
   */
  setupZoomControls() {
    //console.log('Setting up zoom controls...');
    this.chart.zoomControl = new am4maps.ZoomControl();
    this.chart.zoomControl.slider.height = 100;
    this.chart.zoomControl.valign = "bottom";
    this.chart.zoomControl.align = "right";
    this.chart.zoomControl.marginRight = 20;
    this.chart.zoomControl.marginBottom = 20;
  }

  // Remaining functions...

  /**
   * Reset the map view to its default state
   */
  async resetView() {
    //console.log('Resetting view...');
    if (this.chart) {
      this.chart.geodataSource.url = "assets/brazil-states.geojson";
      this.title = "Mapa do Brasil";
      this.chart.geodataSource.events.once("done", () => {
        this.statesWithColors = this.mapaBrasil.features.map((feature: any) => {
          const stateName = feature.properties.sigla;
          return {
            state: feature,
            color: this.initialStateColors[stateName], // Use a cor inicial aqui
            petCount: this.statePetCount[stateName] || 0
          };
        });

        this.statesWithColors.sort((a, b) => b.petCount - a.petCount);
        this.setupPolygonSeries();
        this.setupMapEvents();
        this.chart.invalidateData();
      });
      this.viewingCities = false;
      this.chart.geodataSource.load();
      this.chart.geodataSource.setTimeout(() => {
        this.chart.goHome(800);
      }, 500);
    }
  }

  clearPetsFromMap() {
    //console.log('Clearing pets from map...');
    let petSeries = this.chart.series.values.find(series => series.name === "petSeries") as am4maps.MapImageSeries;
    if (petSeries) {
      this.chart.series.removeIndex(this.chart.series.indexOf(petSeries)).dispose();
    }
  }


  /**
   * Generates a random color.
   * @returns A random color in hex format.
   */
  private randomColor(): string {
    const randomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${randomHex()}${randomHex()}${randomHex()}`;
  }
  getLuminance(hexColor: string): number {
    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
    const b = parseInt(hexColor.substr(5, 2), 16) / 255;

    // Fórmula para calcular a luminância
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  getLabelColor(backgroundColor: string): string {
    const luminance = this.getLuminance(backgroundColor);
    return luminance > 0.5 ? '#000000' : '#FFFFFF'; // Se a cor de fundo for clara, retorna preto. Caso contrário, retorna branco.
  }


  /**
   * Zooms to a specific map object based on its name.
   * @param name Name of the map object.
   */
  focusOnMapObject(name: string) {
    //console.log('Focusing on map object:', name);

    if (this.chart) {
      let targetPolygon = this.polygonSeries.mapPolygons.values.find(polygon => {
        const polygonName = (polygon.dataItem.dataContext as any)?.name;
        return polygonName === name;
      });

      if (targetPolygon) {
        this.chart.zoomToMapObject(targetPolygon);
      } else {
        //console.log("Polígono não encontrado para:", name);
      }
    }
  }
  displayPetsInCity(cityName: string) {
    //console.log('Displaying pets in city:', cityName);

    // Limpe qualquer série de pets existente
    this.clearPetsFromMap();

    // Agora, crie uma nova série de pets
    let petSeries = this.chart.series.push(new am4maps.MapImageSeries());
    petSeries.name = "petSeries"; // Atribua um nome à série para facilitar a recuperação posteriormente

    // Limpe qualquer imagem anterior na série de animais de estimação
    petSeries.mapImages.clear();

    // Filtrar pets que estão na cidade selecionada
    const petsInCity = this.petsList.filter(pet => pet.user.city === cityName);

    // Para cada pet na cidade, adicione um ponto no mapa
    petsInCity.forEach(pet => {

      const point = petSeries.mapImages.create();
      point.latitude = parseFloat(pet.user.latitude);
      point.longitude = parseFloat(pet.user.longitude);

      // Use um MapImage para exibir uma imagem personalizada
      const image = point.createChild(am4core.Image);
      image.href = "assets/images/dog_transparent.png"; // Substitua pelo caminho da sua imagem
      image.width = 5;  // Ajuste o tamanho conforme necessário
      image.height = 5; // Ajuste o tamanho conforme necessário
      image.horizontalCenter = "middle";
      image.verticalCenter = "middle";
    });
  }

  setupCityHoverEvents() {
    //console.log('Setting up city hover events...');

    let cityPolygonTemplate = this.polygonSeries.mapPolygons.template;

    cityPolygonTemplate.events.on("over", (event: any) => {
        const cityData: any = event.target.dataItem.dataContext;
        if(!cityData) return;
        const cityName = cityData?.properties?.name;
        if(!cityName) return;
        this.focusOnMapObject(cityName);
        this.displayPetsInCity(cityName);
    });

    cityPolygonTemplate.events.on("out", (event: any) => {
        this.resetZoom();
        this.clearPetsFromMap();
    });
}


  /**
   * Open a specific state on the map.
   * @param stateName Name of the state.
   */
  async openState(stateName: string) {
    //console.log('Opening state:', stateName);
    if (this.labelSeries) {
      this.labelSeries.mapImages.clear();
    }
    const stateData = this.statesWithColors.find(item => item.state.properties.name === stateName);
    if (stateData) {
      const stateCode = stateData.state.properties.codigo_ibg;
      const targetPolygon = this.polygonSeries.mapPolygons.values.find(polygon => {
        const polygonName = (polygon.dataItem.dataContext as any)?.name;
        return polygonName === stateName;
      });

      if (targetPolygon) {
        const zoomAnimation = this.chart.zoomToMapObject(targetPolygon);
        zoomAnimation.events.on("animationended", async () => {
          // Carregar dados das cidades após a animação de zoom
          this.loadCityDataAndDisplay(stateData.state.properties.name);
        });
      }
    }
  }
  async loadCityDataAndDisplay(stateName: string) {
    //console.log('Loading city data for:', stateName);

    const stateData = this.statesWithColors.find(item => item.state.properties.name === stateName);
    if (stateData) {
        const stateCode = stateData.state.properties.codigo_ibg;
        if(stateCode === '31') {
          return;
        }
        const citiesData = await this.geoDataService.getGeoData(`geojs-${stateCode}-mun.json`);

        this.chart.geodata = citiesData;


        this.setupPolygonSeries();
        this.setupMapEvents();
        this.citiesWithColors = citiesData.features.map((feature: any) => {

          const cityName = feature.properties.name;
          if (!this.initialCityColors[cityName]) {
            this.initialCityColors[cityName] = this.randomColor();
          }
          return {
            city: feature,
            color: this.initialCityColors[cityName],
            petCount: this.cityPetCount[cityName] || 0
          };
        });

        //this.setupCityHoverEvents();  // Adicione esta linha para configurar os eventos de hover para as cidades


        this.citiesWithColors.sort((a, b) => b.petCount - a.petCount);

        let cityPolygonTemplate = this.polygonSeries.mapPolygons.template;
        cityPolygonTemplate.adapter.add("fill", (fill, target) => {
          const name = (target.dataItem.dataContext as any)?.name;
          const foundCity = this.citiesWithColors.find(item => item.city.properties.name === name);
          return am4core.color(foundCity ? foundCity.color : this.randomColor());
        });

        this.title = stateData.state.properties.name;
        this.viewingCities = true;
        this.polygonSeries.mapPolygons.template.clickable = false;
        this.polygonSeries.mapPolygons.template.hoverable = false;
        this.cdRef.detectChanges();
        this.chart.invalidateData();
        this.chart.goHome(800);

        if (this.labelSeries) {
          this.labelSeries.mapImages.clear();
        }
      }
}


  /**
   * Resets the zoom level of the map.
   */
  resetZoom() {
    //console.log('Resetting zoom...');
    if (this.chart) {
      this.chart.goHome(800); // 800 é a duração da animação. Ajuste conforme necessário.
    }
  }

  /**
   * Calculate the number of pets per state and city.
   */
  calculatePetsCount() {
    //console.log('Calculating pets count...');

    this.statePetCount = {};
    this.cityPetCount = {};
    this.petsList.forEach(pet => {

      const stateName = pet.user.state;
      const cityName = pet.user.city;

      // Count pets by state
      if (this.statePetCount[stateName]) {
        this.statePetCount[stateName]++;
      } else {
        this.statePetCount[stateName] = 1;
      }

      // Count pets by city
      if (this.cityPetCount[cityName]) {
        this.cityPetCount[cityName]++;
      } else {
        this.cityPetCount[cityName] = 1;
      }
    });
    this.cdRef.detectChanges();
    //console.log(this.statePetCount);
  }
  updatePetCountsAndColors() {
    //console.log('Updating pet counts and colors...');
    if (this.labelSeries) {
      this.labelSeries.mapImages.clear();
    }
    this.calculatePetsCount();

    // Atualizando statesWithColors
    this.statesWithColors = this.mapaBrasil.features.map((feature: any) => {
      const stateName = feature.properties.sigla;
      const existingState = this.statesWithColors.find(item => item.state.properties.sigla === stateName);
      const existingColor = existingState ? existingState.color : this.randomColor();
      return {
        state: feature,
        color: existingColor,
        petCount: this.statePetCount[stateName] || 0
      };
    });

    // Se estiver visualizando cidades, atualize citiesWithColors
    if (this.viewingCities) {
      this.citiesWithColors = (this.chart.geodata as any).features.map((feature: any) => {
        const cityName = feature.properties.name;
        const existingCity = this.citiesWithColors.find(item => item.city.properties.name === cityName);
        const existingCityColor = existingCity ? existingCity.color : this.randomColor();
        return {
          city: feature,
          color: existingCityColor,
          petCount: this.cityPetCount[cityName] || 0
        };
      });
    }
    this.citiesWithColors.sort((a, b) => b.petCount - a.petCount);
    this.statesWithColors.sort((a, b) => b.petCount - a.petCount);

    if (this.chart) {
      this.chart.invalidateData();
    }
  }


}
