module.exports = {
    currentYear() {
        const today = new Date();
        return today.getFullYear();
    },

    formatTime(sec) {
        let hours = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - hours * 3600) / 60);
        let seconds = sec - hours * 3600 - minutes * 60;

        if (hours && hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return `${hours ? hours + ':' : ''}${minutes}:${seconds}`;
    },

    formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${day}`.padStart(2, '0') + '.' + `${month}`.padStart(2, '0') + '.' + + year;
    },
};
