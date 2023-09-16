import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
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
export class BrasilMapComponent implements OnInit, OnDestroy {
  private chart!: am4maps.MapChart;
  private hitListener: any;
  private polygonSeries!: am4maps.MapPolygonSeries;
  title: string = "Mapa do Brasil";
  public mapaBrasil: any;
  public statesWithColors: { state: any, color: string, petCount: number }[] = [];
  public citiesWithColors: { city: any, color: string, petCount: number }[] = [];
  public viewingCities: boolean = false;
  @Input() petsList: PetDto[] = [];
  @Input() listFiltros: string[] = [];
  public statePetCount: { [stateName: string]: number } = {};
  public cityPetCount: { [cityName: string]: number } = {};

  constructor(private zone: NgZone, private geoDataService: GeoDataService, private cdRef: ChangeDetectorRef) { }

  async ngOnInit() {
    this.initMap();
  }

  async ngOnDestroy() {
    this.disposeMap();
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
          return {
            state: feature,
            color: this.randomColor(),
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
    this.chart.geodata = this.mapaBrasil;
  }

  /**
   * Set up the polygon series for the map
   */
  setupPolygonSeries() {
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
    let labelSeries = this.chart.series.push(new am4maps.MapImageSeries());
    let labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
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
        let label = labelSeries.mapImages.create();
        label.latitude = polygon.visualLatitude;
        label.longitude = polygon.visualLongitude;
        const labelText = (label.children.getIndex(0) as am4core.Label);
        labelText.text = count.toString();

        // Definindo a cor do rótulo com base na cor de fundo
        const backgroundColor = (polygon as any).customColor; // Obter a cor de fundo do polígono
        labelText.fill = am4core.color(this.getLabelColor(backgroundColor));
      }
    });

  }

  /**
   * Set up map events
   */
  setupMapEvents() {
    this.polygonSeries.mapPolygons.template.events.on("hit", this.hitListener = async (event: any) => {
      const zoomAnimation = this.chart.zoomToMapObject(event.target);
      zoomAnimation.events.on("animationended", async () => {
        const stateData: any = event.target.dataItem.dataContext;
        const stateCode = stateData.codigo_ibg;
        const citiesData = await this.geoDataService.getGeoData(`geojs-${stateCode}-mun.json`);
        this.chart.geodata = citiesData;
        this.citiesWithColors = citiesData.features.map((feature: any) => {
          const cityName = feature.properties.name;
          return {
            city: feature,
            color: this.randomColor(),
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
    if (this.chart) {
      this.chart.geodataSource.url = "assets/brazil-states.geojson";
      this.title = "Mapa do Brasil";
      this.chart.geodataSource.events.once("done", () => {
        this.chart.invalidateData();
      });
      this.viewingCities = false;
      this.polygonSeries.mapPolygons.template.clickable = true;
      this.polygonSeries.mapPolygons.template.hoverable = true;
      this.cdRef.detectChanges();
      this.chart.geodataSource.load();
      this.chart.geodataSource.setTimeout(() => {
        this.chart.goHome(800);
      }, 500);
    }
  }
  clearPetsFromMap() {
    let petSeries = this.chart.series.getIndex(2) as am4maps.MapImageSeries;
    if (petSeries) {
      petSeries.mapImages.clear();
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
    if (this.chart) {
      let targetPolygon = this.polygonSeries.mapPolygons.values.find(polygon => {
        const polygonName = (polygon.dataItem.dataContext as any)?.name;
        return polygonName === name;
      });

      if (targetPolygon) {
        this.chart.zoomToMapObject(targetPolygon);
      } else {
        console.log("Polígono não encontrado para:", name);
      }
    }
  }
  displayPetsInCity(cityName: string) {
    // Primeiro, remova quaisquer pontos anteriores
    let petSeries = this.chart.series.getIndex(2) as am4maps.MapImageSeries;
    if (petSeries) {
      petSeries.mapImages.clear();
    } else {
      petSeries = this.chart.series.push(new am4maps.MapImageSeries());
    }

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

  /**
   * Open a specific state on the map.
   * @param stateName Name of the state.
   */
  async openState(stateName: string) {
    const stateData = this.statesWithColors.find(item => item.state.properties.name === stateName);
    if (stateData) {
      const stateCode = stateData.state.properties.codigo_ibg;
      const citiesData = await this.geoDataService.getGeoData(`geojs-${stateCode}-mun.json`);
      this.chart.geodata = citiesData;
      this.citiesWithColors = citiesData.features.map((feature: any) => {
        return { city: feature, color: this.randomColor() };
      });
      this.title = stateData.state.properties.name;
      this.viewingCities = true;
      this.chart.invalidateData();
      this.chart.goHome(800);
    }
  }

  /**
   * Resets the zoom level of the map.
   */
  resetZoom() {
    if (this.chart) {
      this.chart.goHome(800); // 800 é a duração da animação. Ajuste conforme necessário.
    }
  }

  /**
   * Calculate the number of pets per state and city.
   */
  calculatePetsCount() {
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
    console.log(this.statePetCount);
  }

}
