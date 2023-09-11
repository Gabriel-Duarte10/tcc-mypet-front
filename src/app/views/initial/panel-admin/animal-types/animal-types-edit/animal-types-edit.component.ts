import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { AnimalTypeDTO, AnimalTypeRequest, AnimalTypesService } from '../animal-types.service';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'app-animal-types-edit',
  templateUrl: './animal-types-edit.component.html',
  styleUrls: ['./animal-types-edit.component.scss']
})
export class AnimalTypesEditComponent implements OnInit {
  form: FormGroup;
  typeId: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private animalTypesService: AnimalTypesService,
    private modal: NgbModal,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      typeName: ['']
    });
  }

  ngOnInit() {
    const resolvedData: AnimalTypeDTO = this.route.snapshot.data['feature'];
    console.log(resolvedData);
    this.typeId = resolvedData.id;
    this.form.controls['typeName'].setValue(resolvedData.name);
  }

  onSave() {
    const request: AnimalTypeRequest = {
      name: this.form.value.typeName,
      administratorId: this.authService.getUser()?.id || 0 // Adjust as necessary
    };

    this.animalTypesService.update(this.typeId, request).subscribe(
      response => {
        this.openModalSuccess('Tipo de animal atualizado com sucesso!');
      },
      error => {
        this.openModalError('Erro ao atualizar tipo de animal.');
      }
    );
  }

  onDelete() {
    this.animalTypesService.delete(this.typeId).subscribe(
      () => {
        this.openModalSuccess('Tipo de animal excluído com sucesso!');
      },
      error => {
        this.openModalError('Erro ao excluir tipo de animal.');
      }
    );
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
