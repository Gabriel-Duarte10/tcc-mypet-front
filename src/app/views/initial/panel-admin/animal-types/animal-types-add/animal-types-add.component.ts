import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { Router } from '@angular/router';
import { AnimalTypeRequest, AnimalTypesService } from '../animal-types.service';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'app-animal-types-add',
  templateUrl: './animal-types-add.component.html',
  styleUrls: ['./animal-types-add.component.scss']
})
export class AnimalTypesAddComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private animalTypesService: AnimalTypesService,
    private authService: AuthService,
    private modal: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      typeName: ['']
    });
  }

  onSave() {
    const request: AnimalTypeRequest = {
      name: this.form.value.typeName,
      administratorId: this.authService.getUser()?.id || 0
    };

    this.animalTypesService.create(request).subscribe(
      response => {
        this.openModalSuccess('Tipo de animal criado com sucesso!');
      },
      error => {
        this.openModalError('Erro ao criar tipo de animal.');
      }
    );
  }

  onCancel() {
    this.router.navigate(['/initial/panel-admin/animal-types/']);
  }

  openModalError(message: string) {
    const alertModal = this.modal.open(AlertComponent, { size: 'md' });
    alertModal.componentInstance.title = 'Erro';
    alertModal.componentInstance.message = message;
  }

  openModalSuccess(message: string) {
    const alertModal = this.modal.open(AlertComponent, { size: 'md' });
    alertModal.componentInstance.title = 'Sucesso';
    alertModal.componentInstance.message = message;
    alertModal.result.then(() => {
      this.router.navigate(['/initial/panel-admin/animal-types/']);
    });
  }
}
