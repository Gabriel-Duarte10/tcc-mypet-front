import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { CharacteristicDTO, CharacteristicRequest, CharacteristicsService } from '../characteristics.service';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'app-features-edit',
  templateUrl: './features-edit.component.html',
  styleUrls: ['./features-edit.component.scss']
})
export class FeaturesEditComponent implements OnInit {
  form: FormGroup;
  featureId: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private characteristicsService: CharacteristicsService,
    private authService: AuthService,
    private modal: NgbModal,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      categoryName: ['']
    });
  }

  ngOnInit() {
    const resolvedData: CharacteristicDTO = this.route.snapshot.data['feature'];
    this.featureId = resolvedData.id;
    this.form.controls['categoryName'].setValue(resolvedData.name);
  }


  onSave() {
    const request = {
      name: this.form.value.categoryName,
      administratorId: this.authService.getUser()?.id // Ajuste conforme necessário
    } as CharacteristicRequest;

    this.characteristicsService.update(this.featureId, request).subscribe(
      response => {
        this.openModalSuccess('Caracteristica atualizada com sucesso!');
      },
      error => {
        this.openModalError('Erro ao atualizar Caracteristica.');
      }
    );
  }

  onDelete() {
    this.characteristicsService.delete(this.featureId).subscribe(
      () => {
        this.openModalSuccess('Caracteristica excluída com sucesso!');
      },
      error => {
        this.openModalError('Erro ao excluir Caracteristica.');
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
      this.router.navigate(['/initial/panel-admin/features/']);
    });
  }
}
