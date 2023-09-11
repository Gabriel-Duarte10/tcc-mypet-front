import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnimalTypeDTO } from '../../panel-admin/animal-types/animal-types.service';
import { BreedDTO } from '../../panel-admin/breeds/breeds.service';
import { CharacteristicDTO } from '../../panel-admin/features/characteristics.service';
import { SizeDTO } from '../../panel-admin/sizes/sizes.service';
import { ActivatedRoute } from '@angular/router';
import { PetDto } from '../PetUser.service';

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
  statuses: string[] = ['Adotado', 'Disponível']; // Exemplo, ajuste conforme necessário

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const resolvedData = this.route.snapshot.data['dashboardData'];
    this.animalTypes = resolvedData.animalTypes;
    this.breeds = resolvedData.breeds;
    this.characteristics = resolvedData.characteristics;
    this.sizes = resolvedData.sizes;
    this.pets = resolvedData.pets;

    this.form = this.fb.group({
      animalType: [''],
      breed: [''],
      characteristics: [''],
      size: [''],
      status: [''],
      minAge: [''],
      maxAge: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const filterData = this.form.value;
      // Aqui você pode usar os dados do formulário para filtrar os animais ou fazer outra ação
      console.log(filterData);
    }
  }

  onReset() {
    this.form.reset();
  }
}
