import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { SizeDTO, SizeRequest, SizesService } from '../sizes.service';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'app-sizes-edit',
  templateUrl: './sizes-edit.component.html',
  styleUrls: ['./sizes-edit.component.scss']
})
export class SizesEditComponent implements OnInit {
  form: FormGroup;
  sizeId: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sizesService: SizesService,
    private modal: NgbModal,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      sizeName: ['']
    });
  }

  ngOnInit() {
    const resolvedData: SizeDTO = this.route.snapshot.data['size'];
    this.sizeId = resolvedData.id;
    this.form.controls['sizeName'].setValue(resolvedData.name);
  }

  onSave() {
    const request = {
      name: this.form.value.sizeName,
      administratorId: this.authService.getUser()?.id // Ajuste conforme necessário
    } as SizeRequest;

    this.sizesService.update(this.sizeId, request).subscribe(
      response => {
        this.openModalSuccess('Tamanho atualizado com sucesso!');
      },
      error => {
        this.openModalError('Erro ao atualizar tamanho.');
      }
    );
  }

  onDelete() {
    this.sizesService.delete(this.sizeId).subscribe(
      () => {
        this.openModalSuccess('Tamanho excluído com sucesso!');
      },
      error => {
        this.openModalError('Erro ao excluir tamanho.');
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
      this.router.navigate(['/initial/panel-admin/sizes/']);
    });
  }
}
