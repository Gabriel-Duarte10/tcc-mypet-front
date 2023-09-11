import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BreedDTO, BreedRequest, BreedsService } from '../breeds.service';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'app-breeds-add',
  templateUrl: './breeds-add.component.html',
  styleUrls: ['./breeds-add.component.scss']
})
export class BreedsAddComponent implements OnInit {
  form!: FormGroup;
  animalTypes: BreedDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private breedsService: BreedsService,
    private authService: AuthService,
    private modal: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const resolvedData = this.route.snapshot.data['feature'];
    this.animalTypes = resolvedData.animalTypes; // Adicione uma propriedade animalTypes no componente
    this.form = this.fb.group({
      breedName: [''],
      animalTypeId: ['']
    });
  }

  onSave() {
    const request: BreedRequest = {
      name: this.form.value.breedName,
      administratorId: this.authService.getUser()?.id || 0,
      animalTypeId: this.form.value.animalTypeId
    };

    this.breedsService.create(request).subscribe(
      response => {
        this.openModalSuccess('Raça criada com sucesso!');
      },
      error => {
        this.openModalError('Erro ao criar raça.');
      }
    );
  }

  onCancel() {
    this.router.navigate(['/initial/panel-admin/breeds/']);
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
