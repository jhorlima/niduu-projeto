module.exports = (functions) => {
    return {
        sendLikeNotification: require('./sendLikeNotification')(functions)
    };
};