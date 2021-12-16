import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Configuraciones as config} from '../config/configuraciones';
import {Credenciales, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class SesionUsuariosService {
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
  ) {}

  /*
   * Add service methods here
   */

  async ValidarCredenciales(credenciales: Credenciales) {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.usuario,
        clave: credenciales.clave,
      },
    });
    return usuario;
  }

  async CrearToken(usuario: Usuario): Promise<string> {
    let url_crear_token = `${config.url_crear_token}?${config.arg_nombre_token}=${usuario.nombre}&${config.arg_id_persona_token}=${usuario._id}&${config.arg_id_rol_token}=${usuario.id_rol}`;
    let token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmUiOiJKdWFuIEdhcmNpYSIsImlkIjoiNjFhMTY2MTgyNGM5YjkyZGVjMWU2MWNiIiwicm9sIjoiNjE5ZmM0YzUxMmJjNGYzYjA4Zjk4OTAwIn0.0-5lP18BurVBEP3XnJ_-IG9Ox1TTg7cyg9d0OwZWdzA';
    await fetch(url_crear_token).then(async (res: any) => {
      token = await res.text();
      console.log(token);
    });
    return token;
  }
}
