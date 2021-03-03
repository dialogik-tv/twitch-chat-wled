const channel = 'dialogikTV';
const { chat } = new window.TwitchJs({ channel });
const effects = {
    "android": 1,
    "scanner": 2,
    "breathe": 3
}
var currentEffect = 1;

console.log('[SYS] WLED Chatbot Overlay initalized');

chat.connect().then(() => {
    chat.join(channel);
    console.log('[SYS] Channel joined');

    // Reset WLED to default effect (android=1)
    fetch(`http://192.168.2.30/win&PL=1`)
        .then(() => {
            console.log(`[SENT] WLED initialized with default effect`);
        });
}).catch((e) => { console.error('Twitch error in Promise', e); });
// chat.on('PRIVMSG', (message) => {
chat.on('PRIVMSG', (message) => {
    message = message.message;
    if(message.startsWith('!color ') && message != '!color ') {
        let color = message.replace('!color ', '').replace('#', '');
        console.log(`[REQ] Requested color [${color}]`);

        // Only allow Mods, VIPs and Subs to change color
        // if(!(message.tags.mod == 1 || message.tags.badges.vip == 1 || message.tags.subscriber == 1)) {
        //     return;
        // }

        // Ensure color is hex value
        if(color.length == 6) {
            if(!(/^[0-9A-F]{6}$/i.test(color))) {
                console.log(`[ERR] Denying color request, [${color}] is no hex value`);
                return;
            }
            
            fetch(`http://192.168.2.30/win&CL=h${color}`)
                .then(() => console.log(`[SENT] Color request [${color}] sent`));
        } else {
            console.log(`[ERR] No valid color [${color}] specified`);
        }
    }

    // Select next effect
    else if(message == '!fx') {
        // Increase effect ID
        currentEffect = currentEffect + 1;
        if(currentEffect > effects.length) {
            currentEffect = 1;
        }

        console.log(`[REQ] Next effect requested [${currentEffect}]`);

        fetch(`http://192.168.2.30/win&PL=${currentEffect}`)
            .then(() => {
                console.log(`[SENT] Effect [ID ${currentEffect}] request sent`);
            });
    }

    // Select specific preset/effect
    else if(message.startsWith('!fx') && message != '!fx ') {
        let effect = message.replace('!fx ', '');
        console.log(`[REQ] Requested effect [${effect}]`);
        if(!effect in effects) {
            console.log(`[ERR] Denying effect request, [${effect}] is no valid effect`);
            return;
        }

        let effectId = effects[effect];
        currentEffect = effectId;
        console.log(`[REQ] Requested effect [${effect}] [ID ${effectId}]`);
        fetch(`http://192.168.2.30/win&PL=${effectId}`)
            .then(() => {
                console.log(`[SENT] Effect [${effect}] [ID ${effectId}] request sent`);
            });
    }
});