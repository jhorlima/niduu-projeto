'use strict';

class SessionController {

  async index({auth}) {
    try {
      return await auth.getUser();
    } catch (error) {
      response.send('Credentials missing');
    }
  }

  async create({request, auth}) {
    const {username, password} = request.all();
    return await auth.attempt(username, password);
  }
}

module.exports = SessionController;
