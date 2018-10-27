"use strict";

const User = use("App/Models/User");

class UserController {

  async store({request}) {
    try {
      return await User.create(request.only(["name", "username", "email", "password", "bio"]));
    } catch (error) {
      return response.status(400).statusText(error.message).json({
        status: 'error',
        message: 'Ocorreu um problema ao cadastrar o usuário.'
      });
    }
  }

}

module.exports = UserController;
