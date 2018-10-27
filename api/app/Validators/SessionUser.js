'use strict';

const {formatters} = use('Validator');

class SessionUser {
  get rules() {
    return {
      username: 'required|string|min:6|max:100',
      password: 'required|string|min:6|max:15',
    };
  }

  get messages() {
    return {
      'username.required': 'O campo nome de usuário é obrigatório!',
      'username.alpha_numeric': 'O campo nome de usuário pode ter apenas textos e numeros!',
      'username.min': 'O campo nome de usuário precisa ter no mínimo 6 caracteres!',
      'username.max': 'O campo nome de usuário precisa ter no máximo 10 caracteres!',
      'password.required': 'O campo senha é obrigatório!',
      'password.string': 'O campo senha precisa ser um texto válido!',
      'password.min': 'O campo senha precisa ter no mínimo 6 caracteres!',
      'password.max': 'O campo senha precisa ter no máximo 15 caracteres!',
    };
  }

  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      username: 'strip_tags|trim|slug',
    };
  }

  get formatter() {
    return formatters.JsonApi;
  }

  async fails(errorMessages) {
    const response = this.ctx.response;

    response.statusText = "A validação falhou. Tem certeza que você enviou todos os campos corretamente?";

    return response.status(400).send(errorMessages);
  }
}

module.exports = SessionUser;
