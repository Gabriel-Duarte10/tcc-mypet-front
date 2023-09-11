import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { BreedDTO, BreedRequest, BreedsService } from '../breeds.service';

@Component({
  selector: 'app-breeds-edit',
  templateUrl: './breeds-edit.component.html',
  styleUrls: ['./breeds-edit.component.scss']
})
export class BreedsEditComponent implements OnInit {
  form: FormGroup;
  breedId: number = 0;
  animalTypes: BreedDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private breedsService: BreedsService,
    private modal: NgbModal,
    private router: Router
  ) {
    this.form = this.fb.group({
      breedName: [''],
      animalTypeId: ['']
    });
  }

  ngOnInit() {
      const resolvedData = this.route.snapshot.data['feature'];
      this.animalTypes = resolvedData.animalTypes;

      if (resolvedData.breed) {
          this.breedId = resolvedData.breed.id;
          this.form.controls['breedName'].setValue(resolvedData.breed.name);
          this.form.controls['animalTypeId'].setValue(resolvedData.breed.animalType.id);
      }
  }



  onSave() {
    const request: BreedRequest = {
      name: this.form.value.breedName,
      administratorId: 1, // Ajuste conforme necessário
      animalTypeId: this.form.value.animalTypeId
    };

    this.breedsService.update(this.breedId, request).subscribe(
      response => {
        this.openModalSuccess('Raça atualizada com sucesso!');
      },
      error => {
        this.openModalError('Erro ao atualizar raça.');
      }
    );
  }

  onDelete() {
    this.breedsService.delete(this.breedId).subscribe(
      () => {
        this.openModalSuccess('Raça excluída com sucesso!');
      },
      error => {
        this.openModalError('Erro ao excluir raça.');
      }
    );
  }

  openModalError(message: string) {
    const alertModal = this.modal.open(AlertComponent, { size: 'md' });
    alertModal.componentInstance.title = 'Error';
    alertModal.componentInstance.message = message;
  }

  openModalSuccess(message: string) {
    const alertModal = this.modal.open(AlertComponent, { size: 'md' });
    alertModal.componentInstance.title = 'Sucesso';
    alertModal.componentInstance.message = message;
    alertModal.result.then(() => {
      this.router.navigate(['/initial/panel-admin/breeds/']);
    });
  }
}
