import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/core/services/auth.service';
import { SizeRequest, SizesService } from '../sizes.service';

@Component({
  selector: 'app-sizes-add',
  templateUrl: './sizes-add.component.html',
  styleUrls: ['./sizes-add.component.scss']
})
export class SizesAddComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sizesService: SizesService,
    private authService: AuthService,
    private modal: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      sizeName: ['']
    });
  }

  onSave() {
    const request: SizeRequest = {
      name: this.form.value.sizeName,
      administratorId: this.authService.getUser()?.id || 0 // Ajuste conforme necessário
    };

    this.sizesService.create(request).subscribe(
      response => {
        this.openModalSuccess('Tamanho criado com sucesso!');
      },
      error => {
        this.openModalError('Erro ao criar tamanho.');
      }
    );
  }

  onCancel() {
    this.router.navigate(['/initial/panel-admin/sizes/']);
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
      this.router.navigate(['/initial/panel-admin/sizes/']);
    });
  }
}
