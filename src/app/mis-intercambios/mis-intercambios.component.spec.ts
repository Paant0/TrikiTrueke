import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MisIntercambiosComponent } from './mis-intercambios.component';
import { AuthService } from '../Services/auth.service';
import { ArticulosService } from '../Services/articulos.service';
import { IntercambiosService } from '../Services/intercambios.service';
import { UsuariosService } from '../Services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

describe('MisIntercambiosComponent', () => {
  let component: MisIntercambiosComponent;
  let fixture: ComponentFixture<MisIntercambiosComponent>;

  const authServiceMock = {
    currentUser: { id: 'u1', nombre: 'Laura Pérez', email: 'laura@example.com', telefono: '600000000' },
    getMe: jasmine.createSpy('getMe').and.returnValue(of({ id: 'u1', nombre: 'Laura Pérez', email: 'laura@example.com', telefono: '600000000' }))
  };

  const articulosServiceMock = {
    obtenerArticulos: jasmine.createSpy('obtenerArticulos').and.returnValue(of([
      { id: 'a1', nombre: 'Libro', titulo: 'Libro' },
      { id: 'a2', nombre: 'Tablet', titulo: 'Tablet' }
    ]))
  };

  const intercambiosServiceMock = {
    obtenerMisIntercambios: jasmine.createSpy('obtenerMisIntercambios').and.returnValue(of([
      {
        id: 'i1',
        estado: 'PENDIENTE',
        articuloOfrecido: 'a1',
        articuloRecibido: 'a2',
        usuarioOfrece: 'u2',
        usuarioRecibe: 'u1',
        creadoEn: '2026-06-01T10:00:00.000Z'
      }
    ])),
    aceptarIntercambio: jasmine.createSpy('aceptarIntercambio').and.returnValue(of({})),
    rechazarIntercambio: jasmine.createSpy('rechazarIntercambio').and.returnValue(of({})),
    cancelarIntercambio: jasmine.createSpy('cancelarIntercambio').and.returnValue(of({}))
  };

  const usuariosServiceMock = {
    obtenerUsuario: jasmine.createSpy('obtenerUsuario').and.returnValue(of({ nombre: 'Carlos' }))
  };

  const snackBarMock = {
    open: jasmine.createSpy('open')
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisIntercambiosComponent]
    })
      .overrideProvider(AuthService, { useValue: authServiceMock })
      .overrideProvider(ArticulosService, { useValue: articulosServiceMock })
      .overrideProvider(IntercambiosService, { useValue: intercambiosServiceMock })
      .overrideProvider(UsuariosService, { useValue: usuariosServiceMock })
      .overrideProvider(MatSnackBar, { useValue: snackBarMock })
      .overrideProvider(Router, { useValue: routerMock })
      .compileComponents();

    fixture = TestBed.createComponent(MisIntercambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should classify received exchanges as actionable', () => {
    expect(component.totalRecibidos).toBe(1);
    expect(component.totalEnviados).toBe(0);
    expect(component.cantidadAccionables).toBe(1);
  });
});