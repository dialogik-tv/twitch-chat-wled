import colors from './colors.js';

const docBody = document.body;

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
    const username = message.tags.displayName;

    // Sanitize user input
    message = JSON.parse(JSON.stringify(message.message));

    if(message.startsWith('!color ') && message != '!color ') {
        let color = message.replace('!color ', '').replace('#', '');
        console.log(`[REQ] Requested color [${color}]`);

        // Only allow Mods, VIPs and Subs to change color
        // if(!(message.tags.mod == 1 || message.tags.badges.vip == 1 || message.tags.subscriber == 1)) {
        //     return;
        // }

        // Color is text based an in list of CSS3 colors
        if(color in colors) {
            const colorName = color;
            color = colors[color];
            fetch(`http://192.168.2.30/win&CL=h${color}`)
                .then(() => {
                    console.log(`[SENT] Word color request [${color}] sent`);
                    success(username, 'color', colorName);
                });
        }
        // Check if color is hex value
        else if(/^[0-9A-F]{6}$/i.test(color)) {
            fetch(`http://192.168.2.30/win&CL=h${color}`)
                .then(() => {
                    console.log(`[SENT] Hex color request [${color}] sent`);
                    success(username, 'color', '#'+color);
                });
        }
        // Check if color is valid RGB statement (0-255,0-255,0-255)
        else if(/(25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)\,(25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)\,(25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)/.test(color)) {
            const colorRgb = color;
            color = rgbToHex(color);
            fetch(`http://192.168.2.30/win&CL=h${color}`)
            .then(() => {
                console.log(`[SENT] RGB color request [${color}] sent`);
                success(username, 'color', colorRgb);
            });
        }
        else {
            console.log(`[ERR] No valid color [${color}] specified`);
            error('Ungültige Farbe');
        }
    }

    // Select next effect
    else if(message == '!fx') {
        // Increase effect ID
        currentEffect = currentEffect + 1;
        if(currentEffect > Object.values(effects).length) {
            currentEffect = 1;
        }

        const keys = Object.keys(effects);
        const currentKeyName = keys[currentEffect-1];

        console.log(`[REQ] Next effect requested [${currentEffect}]`);

        fetch(`http://192.168.2.30/win&PL=${currentEffect}`)
            .then(() => {
                console.log(`[SENT] Effect [ID ${currentEffect}] request sent`);
                success(username, 'fx', currentKeyName);
            });
    }

    // Select specific preset/effect
    else if(message.startsWith('!fx') && message != '!fx ') {
        let effect = message.replace('!fx ', '');
        console.log(`[REQ] Requested effect [${effect}]`);
        if(!(effect in effects)) {
            console.log(`[ERR] Denying effect request, [${effect}] is no valid effect`);
            error('Ungültiger Effekt');
            return;
        }

        let effectId = effects[effect];
        currentEffect = effectId;
        console.log(`[REQ] Requested effect [${effect}] [ID ${effectId}]`);
        fetch(`http://192.168.2.30/win&PL=${effectId}`)
            .then(() => {
                console.log(`[SENT] Effect [${effect}] [ID ${effectId}] request sent`);
                success(username, 'fx', effect);
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

function success(username, type, input) {
    // Feedback div element
    const holder = document.createElement('div');
    holder.id = 'feedback-info';
    holder.classList.add('animate__animated');

    // User username to feedback info
    const userlabel = `<span class="username">${username}</span>`;
    holder.innerHTML = userlabel;

    // Handle effect requests
    if(type == 'fx') {
        const fxHolder = document.createElement('span');
        fxHolder.classList.add('fx');
        fxHolder.innerText = input;
        holder.append(fxHolder);
    // Handle color requests
    } else {
        // Color element
        const colorHolder = document.createElement('span');
        colorHolder.classList.add('color');

        // Color square element (color preview)
        const colorSquare = document.createElement('div');
        colorSquare.classList.add('color-square');
        colorSquare.style.backgroundColor = input;

        // Add requested color to output
        colorHolder.innerText = input;
        colorHolder.prepend(colorSquare);

        // Append result to feedback info element
        holder.append(colorHolder);
    }

    // Show result
    holder.classList.add('animate__backInRight');
    docBody.append(holder);

    // Hide result after 3 secs
    setTimeout(function() {
        holder.classList.remove('animate__backInRight');
        holder.classList.add('animate__backOutRight');
        setTimeout(function() {
            holder.remove();
        }, 1000);
    }, 3000);
}

function error(text) {
    // Feedback div element
    const holder = document.createElement('div');
    holder.id = 'feedback-info';
    holder.classList.add('animate__animated');

    // Get feedback info element
    holder.classList.add('error');
    holder.innerHTML = `<span class="error-details">${text}</span><span class="error-meta">siehe !wled</span>`;

    // Show result
    holder.classList.add('animate__backInRight');
    docBody.append(holder);

    // Hide result after 3 secs
    setTimeout(function() {
        holder.classList.remove('animate__backInRight');
        holder.classList.add('animate__backOutRight');
        setTimeout(function() {
            holder.classList.remove('error');
            holder.remove();
        }, 1000);
    }, 3000);
}