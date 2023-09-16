import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { Router } from '@angular/router';
import { CharacteristicRequest, CharacteristicsService } from '../characteristics.service';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'app-features-add',
  templateUrl: './features-add.component.html',
  styleUrls: ['./features-add.component.scss']
})
export class FeaturesAddComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private characteristicsService: CharacteristicsService,
    private authService: AuthService,
    private modal: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      categoryName: ['']
    });
  }

  onSave() {
    const request: CharacteristicRequest = {
      name: this.form.value.categoryName,
      administratorId: this.authService.getUser()?.id || 0 // Ajuste conforme necessário
    };

    this.characteristicsService.create(request).subscribe(
      response => {
        this.openModalSuccess('Caracteristica criada com sucesso!');
      },
      error => {
        this.openModalError('Erro ao criar Caracteristica.');
      }
    );
  }

  onCancel() {
    this.router.navigate(['/initial/panel-admin/features/']);
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
      this.router.navigate(['/initial/panel-admin/features/']);
    });
  }
}
