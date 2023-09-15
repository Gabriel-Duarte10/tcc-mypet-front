import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4geodata_brazilLow from "@amcharts/amcharts4-geodata/brazilLow";
import { GeoDataService } from 'src/core/services/geo-data.service';
import { ChangeDetectorRef } from '@angular/core';

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
  listFiltros: any[] = [{ id: 1, nome: 'Filtro 1' }, { id: 2, nome: 'Filtro 2' }, { id: 3, nome: 'Filtro 3' }];
  private colors: string[] = [];
  private usedColors: Set<string> = new Set();
  public statesWithColors: { state: any, color: string }[] = [];
  public citiesWithColors: { city: any, color: string }[] = [];
  public viewingCities: boolean = false;

  constructor(private zone: NgZone, private geoDataService: GeoDataService, private cdRef: ChangeDetectorRef) { }

  async ngOnInit() {
    this.zone.runOutsideAngular(async () => {
      try {
        let chart = am4core.create("chartdiv", am4maps.MapChart);

        // Carregando o arquivo GeoJSON dos estados do Brasil
        this.mapaBrasil = await this.geoDataService.getGeoData('brazil-states.geojson');
        this.statesWithColors = this.mapaBrasil.features.map((feature: any) => {
          return { state: feature, color: this.randomColor() };
        });

        const brazilStatesData = this.mapaBrasil;
        chart.geodata = brazilStatesData;

        this.polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());  // Modifique esta linha
        this.polygonSeries.useGeodata = true;

        let polygonTemplate = this.polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";

        polygonTemplate.adapter.add("fill", (fill, target) => {
          const name = (target.dataItem.dataContext as any)?.name;
          const foundState = this.statesWithColors.find(item => item.state.properties.name === name);
          return am4core.color(foundState ? foundState.color : this.randomColor());
        });

        polygonTemplate.events.on("hit", this.hitListener = (event: any) => {
          const zoomAnimation = chart.zoomToMapObject(event.target);
          zoomAnimation.events.on("animationended", async () => {
            const stateData: any = event.target.dataItem.dataContext;
            const stateCode = stateData.codigo_ibg;
            const citiesData = await this.geoDataService.getGeoData(`geojs-${stateCode}-mun.json`);
            this.chart.geodata = citiesData;
            this.citiesWithColors = citiesData.features.map((feature: any) => {
              return { city: feature, color: this.randomColor() };
            });
            let cityPolygonTemplate = this.polygonSeries.mapPolygons.template;
            cityPolygonTemplate.adapter.add("fill", (fill, target) => {
              const name = (target.dataItem.dataContext as any)?.name;
              const foundCity = this.citiesWithColors.find(item => item.city.properties.name === name);
              return am4core.color(foundCity ? foundCity.color : this.randomColor());
            });
            this.title = stateData.name; // ou a propriedade que contém o nome do estado
            this.viewingCities = true;
            this.polygonSeries.mapPolygons.template.clickable = false;
            this.polygonSeries.mapPolygons.template.hoverable = false;
            this.cdRef.detectChanges();
            this.chart.invalidateData();
            this.chart.goHome(800);
            this.chart.goHome(800);

          });
        });

        chart.zoomControl = new am4maps.ZoomControl();
        chart.zoomControl.slider.height = 100;
        chart.zoomControl.valign = "bottom";
        chart.zoomControl.align = "right";
        chart.zoomControl.marginRight = 20;
        chart.zoomControl.marginBottom = 20;

        this.chart = chart;
      } catch (error) {
        console.error("Erro ao carregar os dados geográficos:", error);
        // Aqui você pode adicionar uma mensagem de erro para o usuário, por exemplo:
        alert("Houve um problema ao carregar o mapa. Por favor, tente novamente mais tarde.");
      }
    });
  }

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

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        // Remova o ouvinte de eventos aqui
        this.polygonSeries.mapPolygons.template.events.off("hit", this.hitListener);  // Modifique esta linha
        this.chart.dispose();
      }
    });
  }
  // Função para gerar cores aleatórias
  private randomColor(): string {
    const randomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${randomHex()}${randomHex()}${randomHex()}`;
  }

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
  resetZoom() {
    if (this.chart) {
      this.chart.goHome(800); // 800 é a duração da animação. Ajuste conforme necessário.
    }
  }

}
