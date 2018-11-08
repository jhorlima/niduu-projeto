module.exports = (functions) => {
    const admin = require('firebase-admin');
    const serviceAccount = require('./../config/niduu-1961d-firebase-adminsdk-tgmg8-aed6994dff');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://niduu-1961d.firebaseio.com'
    });

    const likesRef = functions.database.ref( '/photos/{photoId}/likes/{userLikeUid}');

    return likesRef.onCreate((snapshot, context) => {

        return snapshot.ref.parent.parent.child('uid').once("value").then(userUid => {

            if (userUid.val() === context.auth.uid) {
                return console.log(`The user likes his photo.`);
            }

            const userLikeUid = context.auth.uid;
            const tokenNotificationRef = admin.database().ref(`/tokens_messaging/${userUid.val()}/tokens`);

            return Promise.all([tokenNotificationRef.once('value'), admin.auth().getUser(userLikeUid)]).then(results => {
                const tokens = results.shift();
                const user = results.shift();

                if (!tokens.hasChildren()) {
                    return console.log('There are no notification tokens to send to.');
                }

                const payload = {
                    notification: {
                        title: 'Você tem uma nova curtida!',
                        body: `${user.displayName} curtiu sua foto.`,
                        icon: user.photoURL
                    }
                };
                const tokensVal = tokens.val();
                const tokenList = Object.keys(tokensVal).map(key => tokensVal[key]);

                return admin.messaging().sendToDevice(tokenList, payload).then(success => {
                    console.log(success);
                }).catch(err => {
                    console.log(err);
                });

            }).catch(err => {
                return err.message;
            });
        });

    });

};