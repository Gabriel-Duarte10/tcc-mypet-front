import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { AuthService } from 'src/core/services/auth.service';
import { LoadingService } from 'src/core/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    login: '',
    password: ''
  };
  constructor(
    private auth: AuthService,
    private router: Router,
    private modal: NgbModal) {}

  onSubmit(form: NgForm) {
    LoadingService.show();
    if (form.valid) {
      this.auth.login(this.credentials).then(success => {
        if (success) {
          LoadingService.hide();
          this.openModalSucesso('Login realizado com sucesso!');
        }
      })
      .catch(error => {
        LoadingService.hide();
        this.openModalError(error.error.message);
      });
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
  forgetPassword() {
    this.router.navigate(['/forgot-password']);
  }
  openModalError(message: string){
    const alertModal = this.modal.open(AlertComponent, { size: 'md' });
    alertModal.componentInstance.title = 'Error';
    alertModal.componentInstance.message = message;
    alertModal.result;
  }
  openModalSucesso(message: string){
    const alertModal = this.modal.open(AlertComponent, { size: 'md' });
    alertModal.componentInstance.title = 'Sucesso';
    alertModal.componentInstance.message = message;
    alertModal.result.then(() => {
      window.location.reload();
    });
  }
}
