'use strict';

// const Axios = use('axios');
const Helpers = use('Helpers');
const Photo = use('App/Models/Photo');

/**
 * Resourceful controller for interacting with photos
 */
class PhotoController {

  /**
   * Show a list of all photos.
   * GET photos
   */
  async index({auth}) {
    const user = await auth.getUser();

    const photos = await Photo.query()
      .with('likes', (builder) => {
        builder.where('user_id', user.id);
      })
      .with('user')
      .withCount('likes')
      .whereRaw("created_at > datetime('now', '-1 day')")
      .orderBy('created_at', 'desc')
      .fetch();

    return photos.toJSON().map(function (photo) {
      return {
        owner: photo.user_id === user.id,
        liked: !!photo.likes.find(like => {
          return like.pivot.user_id === user.id;
        }),
        ...photo
      };
    });
  }

  /**
   * Create/save a new photo.
   * POST photos
   */
  async store({request, auth}) {

    const user = await auth.getUser();
    const {latitude, longitude} = request.all();

    const image = request.file('image', {
      types: ['image'],
      size: '2mb'
    });

    await image.move(Helpers.tmpPath('uploads'), {
      name: `${new Date().getTime()}.${image.subtype}`,
    });

    if (!image.moved()) {
      return image.error();
    }

    return await user.photos().create({
      path: image.fileName,
      latitude: latitude,
      longitude: longitude
    });
  }

  /**
   * Display a single photo.
   * GET photos/uploads/:path
   */
  async uploads({params, response}) {
    return response.download(Helpers.tmpPath(`uploads/${params.path}`));
  }

  /**
   * Display a single photo.
   * GET photos/:id
   */
  async show({params}) {
    const photo = await Photo.findOrFail(params.id);
    await photo.load('user');
    return photo;
  }

  /**
   * Delete a photo with id.
   * DELETE photos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({params, auth}) {

    const user = await auth.getUser();

    const deletePhoto = await Photo.query().where('id', params.id).where('user_id', user.id).delete();

    if (!deletePhoto) {
      return new Error("Não foi possível apagar essa foto!");
    }

    return {
      message: "OK",
      deletePhoto: deletePhoto
    };

  }

  async like({params, auth}) {
    const user = await auth.getUser();
    const photo = await Photo.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .whereDoesntHave('likes', (builder) => {
        builder.where('user_id', user.id);
      }).firstOrFail();

    await photo.likes().attach([user.id]);

    return photo;
  }

  async unlike({params, auth}) {
    const user = await auth.getUser();

    const photo = await Photo.query()
      .with('likes')
      .where('id', params.id)
      .where('user_id', user.id)
      .whereHas('likes', (builder) => {
        builder.where('user_id', user.id);
      }).firstOrFail();

    await photo.likes().detach([user.id]);

    return photo;
  }
}

module.exports = PhotoController;
