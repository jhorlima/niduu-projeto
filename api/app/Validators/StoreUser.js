'use strict';

const {formatters} = use('Validator');

class StoreUser {
  get rules() {
    return {
      name: 'required|string|min:6|max:100',
      username: 'required|alpha_numeric|min:6|max:10|unique:users',
      email: 'required|email|string|min:6|max:100|unique:users',
      password: 'required|string|min:6|max:15',
      bio: 'string|min:6|max:100',
    };
  }

  get messages() {
    return {
      'name.required': 'O campo nome é obrigatório!',
      'name.string': 'O campo nome precisa ser um texto válido!',
      'name.min': 'O campo nome precisa ter no mínimo 6 caracteres!',
      'name.max': 'O campo nome precisa ser no máximo 100 caracteres!',
      'username.required': 'O campo nome de usuário é obrigatório!',
      'username.unique': 'O nome de usuário enviado já foi cadastrado!',
      'username.alpha_numeric': 'O campo nome de usuário pode ter apenas textos e numeros!',
      'username.min': 'O campo nome de usuário precisa ter no mínimo 6 caracteres!',
      'username.max': 'O campo nome de usuário precisa ter no máximo 10 caracteres!',
      'email.required': 'O campo e-mail é obrigatório!',
      'email.email': 'O e-mail enviado é inválido!',
      'email.unique': 'O e-mail enviado já foi cadastrado!',
      'email.min': 'O campo e-mail precisa ter no mínimo 6 caracteres!',
      'email.max': 'O campo e-mail precisa ter no máximo 100 caracteres!',
      'password.required': 'O campo senha é obrigatório!',
      'password.string': 'O campo senha precisa ser um texto válido!',
      'password.min': 'O campo senha precisa ter no mínimo 6 caracteres!',
      'password.max': 'O campo senha precisa ter no máximo 15 caracteres!',
      'bio.string': 'O campo bio precisa ser um texto válido!',
      'bio.min': 'O campo bio precisa ter no mínimo 6 caracteres!',
      'bio.max': 'O campo bio precisa ter no máximo 100 caracteres!',
    };
  }

  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      name: 'strip_tags|trim',
      email: 'normalize_email',
      age: 'to_int',
      username: 'strip_tags|trim|slug',
      bio: 'escape',
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

module.exports = StoreUser;
