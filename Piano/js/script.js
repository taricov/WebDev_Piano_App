let keyboard = document.querySelector('.piano-keyboard');
let controls = document.querySelectorAll('.piano-control-option');
let songSelect = document.querySelector('.piano-song-list');
let tempoInp = document.querySelector('.piano-tempo');
let playBtn = document.querySelector('.piano-play-btn');

let pianoNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let keyMap = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N'];

let keys = [];        

let jingleBells = `B3,,B3,,B3,,,,B3,,B3,,B3,,,,
                    B3,,D4,,G3,,A3,B3,,,,,,
                    C4,,C4,,C4,,,,C4,C4,,B3,,B3,,,,
                    B3,B3,B3,,A3,,A3,,B3,,A3,,,,D4`;
let happyBirthday = `G4,G4,A4,,G4,,C5,,B4,,,,
                     G4,G4,A4,,G4,,D5,,C5,,,,
                     G4,G4,G5,,E5,,C5,,B4,,A4,,
                     F5,F5,E5,,C5,,D5,,C5,,,,`;

let playSong = (notesString, tempo = 2, cb) => {
let notes = notesString.split(",");
let currentNote = 0;
let mousedownEvent = new Event("mousedown");
let mouseupEvent = new Event("mouseup");
let btn;

let interval = setInterval(() => {
    if (currentNote < notes.length) {
    if (notes[currentNote] !== "") {
        if (btn) {
        btn.dispatchEvent(mouseupEvent);
        }
        btn = document.querySelector(
        `[data-letter-note=${notes[currentNote]}]`
        );
        btn.dispatchEvent(mousedownEvent);
    }
    currentNote++;
    } else {
    btn.dispatchEvent(mouseupEvent);
    clearInterval(interval);
    cb();
    }
}, 100 * tempo);
}
playBtn.addEventListener('click', () => {
    let tempo = tempoInp.value;
    let songNum = songSelect.value;
    playBtn.disabled = true;
    switch(songNum) {
        case '1' : playSong(jingleBells, tempo, () => playBtn.disabled = false); break;
        case '2' : playSong(happyBirthday, tempo, () => playBtn.disabled = false); break;
    }
})

let init = () => {
    for(let i = 1; i <= 5; i++) {
        for(let j = 0; j < 7; j++) {
            let key = createKey('white', pianoNotes[j], i);
            keyboard.appendChild(key);

            if(j != 2 && j != 6) {
            key = createKey('black', pianoNotes[j], i);
            let emptySpace = document.createElement('div');
            emptySpace.className = 'empty-space';
            keyboard.appendChild(emptySpace);
            emptySpace.appendChild(key);

            }
        }
    }
}

let createKey = (type, note, octave) => {
    let key = document.createElement('button');
    key.className = `piano-key piano-key-${type}`;
    key.dataset.letterNote = type == 'white' ? note + octave : note + '#' + octave;
    key.dataset.letterNoteFileName = type == 'white' ? note + octave : note + 's' + octave;
    key.textContent = key.dataset.letterNote;
    keys.push(key);    


    key.addEventListener('mousedown', () => {
        playSound(key);
        key.classList.add('piano-key-playing');
    })

    key.addEventListener('mouseup', () => { 
        key.classList.remove('piano-key-playing');
    })
    
    key.addEventListener('mouseleave', () => {
        key.classList.remove('piano-key-playing');
    })   

    return key;
}

document.addEventListener('keyup', (e) => {
    if (e.repeat) {
        return;
    }
    let lastLetter = e.code.substring(e.code.length-1);
    let isShiftPressed = e.shiftKey;
    let selector;
    if(isShiftPressed) {
        selector = `[data-keyboaed='⇧+${lastLetter}]`;
    } else {
        selector = `[data-keyboaed='${lastLetter}]`;
    }
    let key = document.querySelector(selector);
    if(key !== null) {
        let mousedown = new Event('mousedown');
        key.dispatchEvent(mousedown);
    }
})
document.addEventListener('keydown', (e) => {
    if (e.repeat) {
        return;
    }
    let lastLetter = e.code.substring(e.code.length-1);
    let isShiftPressed = e.shiftKey;
    let selector;
    if(isShiftPressed) {
        selector = `[data-keyboaed='⇧+${lastLetter}]`;
    } else {
        selector = `[data-keyboaed='${lastLetter}]`;
    }
    let key = document.querySelector(selector);
    if(key !== null) {
        let mouseup = new Event('mouseup');
        key.dispatchEvent(mouseup);
    }
})

let playSound = (key) => {
    let audio = document.createElement('audio');
    audio.src = 'sounds/' + key.dataset.letterNoteFileName + '.mp3';
    audio.play().then(() => audio.remove());
}

controls.forEach((input) => {
    input.addEventListener('input', () => {
        let value = input.value;
        let type;
        switch(value) {
            case 'letterNotes': type = 'letterNote'; break;
            case 'keyboard': type = 'keyboard'; break;
            case 'none': type = ''; 
        }
        keys.forEach((key) => {
            key.textContent = key.dataset[type];
        })
    })
})

init();