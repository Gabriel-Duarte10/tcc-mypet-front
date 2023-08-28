import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/core/components/alert/alert.component';
import { UserRegistration } from 'src/core/interfaces/user';
import { AuthService } from 'src/core/services/auth.service';
import { LoadingService } from 'src/core/services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cellphone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modal: NgbModal) {}

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.registerForm.valid) {
      LoadingService.show();
      const formData = this.registerForm.getRawValue() as UserRegistration;

      this.auth.register(formData).then(success => {
        if (success) {
          LoadingService.hide();
          this.openModalSucesso('Usuário cadastrado com sucesso!');
        }
      })
      .catch(error => {
        LoadingService.hide();
        this.openModalError(error.error.message);  // Aqui, usamos error.error.message para acessar a mensagem de erro do servidor.
      });
    }
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
      this.router.navigate(['/login']);
    });
  }
}
