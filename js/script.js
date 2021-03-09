import colors from './colors.js';

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

        // Color is text based an in list of CSS3 colors
        if(color in colors) {
            console.log('before', color)
            color = colors[color];
            console.log('after', color);
            fetch(`http://192.168.2.30/win&CL=h${color}`)
                .then(() => console.log(`[SENT] Word color request [${color}] sent`));
        }
        // Check if color is hex value
        else if(/^[0-9A-F]{6}$/i.test(color)) {
            fetch(`http://192.168.2.30/win&CL=h${color}`)
                .then(() => console.log(`[SENT] Hex color request [${color}] sent`));
        }
        // Check if color is valid RGB statement (0-255,0-255,0-255)
        else if(/(25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)\,(25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)\,(25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)/.test(color)) {
            color = rgbToHex(color);
            fetch(`http://192.168.2.30/win&CL=h${color}`)
                .then(() => console.log(`[SENT] RGB color request [${color}] sent`));
        }
        else {
            console.log(`[ERR] No valid color [${color}] specified`);
        }
    }

    // Select next effect
    else if(message == '!fx') {
        // Increase effect ID
        currentEffect = currentEffect + 1;
        if(currentEffect > Object.values(effects).length) {
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

function componentToHex(c) {
    var hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    rgb = rgb.split(",");
    return componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}