import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { AuthService } from 'src/core/services/auth.service';
import { LoadingService } from 'src/core/services/loading.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  step: number = 1;
  email: string = '';
  phone: string = '';
  code: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private auth: AuthService, private router: Router, private modal: NgbModal) {}

  nextStep() {
    LoadingService.show();
    this.auth.initiateResetPassword(this.email)
    .then(response => {
      // Aqui, você pode lidar com a resposta. Por exemplo, se a resposta contiver um número de telefone:
      this.phone = response;
      this.step = 2;
      LoadingService.hide();
    })
    .catch(error => {
      LoadingService.hide();
      // Aqui, você pode lidar com erros. Por exemplo, mostrar uma mensagem de erro para o usuário.
      this.openModalError(error.error.message);
    });
  }

  validateCode() {
    LoadingService.show();
    this.auth.validateResetCode(this.email, parseInt(this.code))
      .then(response => {
        // Aqui, você pode lidar com a resposta. Se o código for validado com sucesso, você pode ir para a etapa 3:
        this.step = 3;
        LoadingService.hide();
      })
      .catch(error => {
        LoadingService.hide();
        // Aqui, você pode lidar com erros. Por exemplo, mostrar uma mensagem de erro para o usuário.
        console.error("Erro ao validar o código:", error.error.message);
        this.openModalError("Erro ao validar o código:" + error.error.message);
      });
  }

  resetPassword() {
    LoadingService.show();
    if (this.newPassword === this.confirmPassword) {
      this.auth.completeResetPassword(this.email, this.newPassword, this.confirmPassword)
        .then(success => {
          if (success) {
            this.step = 4;
            LoadingService.hide();
          }
        })
        .catch(error => {
          LoadingService.hide();
          // Aqui, você pode lidar com erros. Por exemplo, mostrar uma mensagem de erro para o usuário.
          this.openModalError(error.error.message);
        });
    } else {
      LoadingService.hide();
      // As senhas não correspondem. Você pode mostrar uma mensagem para o usuário.
      this.openModalError('As senhas não correspondem.');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  openModalError(message: string){
    const alertModal = this.modal.open(AlertComponent, { size: 'md' });
    alertModal.componentInstance.title = 'Error';
    alertModal.componentInstance.message = message;
    alertModal.result;
  }
}
