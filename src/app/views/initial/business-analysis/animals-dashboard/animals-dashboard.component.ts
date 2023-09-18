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
  petsAll: PetDto[] = []; // Exemplo, ajuste conforme necessário
  statuses: string[] = ['Adotado', 'Disponível']; // Exemplo, ajuste conforme necessário
  listFiltros: string[] = [];  // Adicione esta linha

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
      endDate: [''] // Adicione isso
    });

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
  }



  onReset() {
    this.form.reset();
  }
}
