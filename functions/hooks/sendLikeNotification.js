module.exports = (functions, admin) => {
    const pathLike = '/photos/{userUid}/likes/{userLikeUid}';
    const likesRef = functions.database.ref(pathLike);
    console.log("chegou!", likesRef);

    return likesRef.onCreate((change, context) => {
        console.log("chegou!");

        const userUid = context.params.userUid;
        const userLikeUid = context.params.userLikeUid;

        const pathTokenNotification = `/tokens_messaging/${userUid}/token`;
        const tokenNotificationRef = functions.database().ref(pathTokenNotification);

        const getLikeProfilePromise = admin.auth().getUser(userLikeUid);
        const getToken = tokenNotificationRef.once('value');

        return Promise.all([getToken, getLikeProfilePromise]).then(results => {

            const token = results[0];
            const user = results[1];

            console.log(results);

            // // Check if there are any device tokens.
            // if (!tokensSnapshot.hasChildren()) {
            //     return console.log('There are no notification tokens to send to.');
            // }
            // console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
            // console.log('Fetched follower profile', follower);
            //
            // // Notification details.
            // const payload = {
            //     notification: {
            //         title: 'You have a new follower!',
            //         body: `${follower.displayName} is now following you.`,
            //         icon: follower.photoURL
            //     }
            // };
            //
            // // Listing all tokens as an array.
            // tokens = Object.keys(tokensSnapshot.val());
            // // Send notifications to all tokens.
            // return admin.messaging().sendToDevice(tokens, payload);
        }).then((response) => {
            console.log(response);
            // For each message check if there was an error.
            // const tokensToRemove = [];
            // response.results.forEach((result, index) => {
            //     const error = result.error;
            //     if (error) {
            //         console.error('Failure sending notification to', tokens[index], error);
            //         // Cleanup the tokens who are not registered anymore.
            //         if (error.code === 'messaging/invalid-registration-token' ||
            //             error.code === 'messaging/registration-token-not-registered') {
            //             tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
            //         }
            //     }
            // });
            // return Promise.all(tokensToRemove);
        });
    });

};