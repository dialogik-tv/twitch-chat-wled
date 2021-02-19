const channel = 'dialogikTV';
const { chat } = new window.TwitchJs({ channel });
chat.connect().then(() => {
    chat.join(channel);
}).catch((e) => { console.error('Twitch error in Promise', e); });
// chat.on('PRIVMSG', (message) => {
chat.on('PRIVMSG', (message) => {
    message = message.message;
    if(message.startsWith('!color ') && message !== '!color ') {
        let color = message.replace('!color ', '').replace('#', '');
        console.log(`Requested color [${color}]`);

        // Only allow Mods, VIPs and Subs to change color
        // if(!(message.tags.mod == 1 || message.tags.badges.vip == 1 || message.tags.subscriber == 1)) {
        //     return;
        // }

        // Ensure color is hex value
        if(!(/^[0-9A-F]{6}$/i.test(color))) {
            console.log(`Denying color request, [${color}] is no hex value`);
            return;
        }

        // Todo: add more features!
        // https://github.com/Aircoookie/WLED/wiki/HTTP-request-API
        fetch(`http://192.168.2.122/win&CL=h${color}`)
            .then(() => console.log(`Color [${color}] request sent`));
    }
});