import {Notificacion} from '../../src/models/entities/notificacion';
import { jest } from '@jest/globals';


describe('Clase Notificacion', () => {
  let notificacion;

  beforeEach(() => {
    notificacion = new Notificacion('usuario123', 'Tu pedido fue enviado');
  });

  test('Crear con los valores correctos', () => {
    expect(notificacion.receptor).toBe('usuario123');
    expect(notificacion.mensaje).toBe('Tu pedido fue enviado');
    expect(notificacion.leida).toBe(false);
    expect(notificacion.fechaAlta).toBeInstanceOf(Date);
    expect(notificacion.fechaLeida).toBeNull();
  });

  test('Marcar la notificacon como leida', () => {
    notificacion.marcarComoLeida();
    expect(notificacion.leida).toBe(true);
    expect(notificacion.fechaLeida).toBeInstanceOf(Date);
  });
});
