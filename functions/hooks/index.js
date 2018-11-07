module.exports = (functions, admin) => {
    return {
        sendLikeNotification: require('./sendLikeNotification')(functions, admin)
    };
};