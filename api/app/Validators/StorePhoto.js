'use strict';

const {formatters} = use('Validator');

class StorePhoto {
  get rules() {
    return {
      image: 'required|file|file_ext:png,jpg|file_size:2mb',
      latitude: 'required_if:longitude|number',
      longitude: 'required_if:latitude|number',
    };
  }

  get messages() {
    return {
      'image.required': 'Nenhum arquivo de imagem foi enviado!',
      'image.file': 'Nenhum arquivo de imagem foi enviado!',
      'image.file_ext': 'O arquivo enviado não é uma imagem!',
      'image.file_size': 'O arquivo de imagem excedeu o tamanho máximo de 2mb!',
      'latitude.number': 'O campo latitude precisa ser um número válido!',
      'latitude.required_if': 'O campo longitude é obrigatório se existir o campo latitude!',
      'longitude.number': 'O campo longitude precisa ser um número válido!',
      'longitude.required_if': 'O campo latitude é obrigatório se existir o campo longitude!',
    };
  }

  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      latitude: 'strip_tags|trim',
      longitude: 'normalize_email',
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

module.exports = StorePhoto;
