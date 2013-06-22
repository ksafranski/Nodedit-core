/**
 * @function nodedit.keybind
 * 
 * Instantiated to create keybindings
 * 
 * var konami = new nodedit.keybind({
 *      code: 'up up down down left right left right b a',
 *      timeout: 5000,
 *      callback: function(){
 *           alert('KONAMI!');
 *      }
 *   });
 */
nodedit.keybind = function(params){
    
    /**
     * Assign combo code
     */
 
    this.code = params.code || null;
    
    /**
     * Timeout before cur_combo resets
     */
 
    this.timeout = params.timeout || 3000;
    
    /**
     * Callback
     */
 
    this.callback = params.callback || false;
    
    /**
     * Holds currently entered combo
     */
 
    this.cur_combo = '';
    
    /**
     * Starts the key listener, timer and check
     */
 
    this.init = function(){
        
        var _this = this;
        
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var name = _this.keycodes[evt.keyCode];
            if(_this.cur_combo.length>0){
                _this.cur_combo += ' ';
            }
            _this.cur_combo += name;
            _this.runTimer();
            _this.checkCode();
        };
        
    };
    
    /**
     * Controls duration of time available to complete code
     */
    
    this.runTimer = function(){
        var _this = this;
        
        // Clear timeout
        if(this.combotimer){ 
            clearTimeout(this.combotimer);   
        }
        
        this.combotimer = setTimeout(function(){
            _this.cur_combo = '';
        }, this.timeout);
    };
    
    /**
     * Checks for code match and fires callback
     */
    
    this.checkCode = function(){
        if (this.cur_combo===this.code && this.callback){
            this.cur_combo = '';
            this.callback();
        }
    };
    
    /**
     * Library of keycodes
     */
    
    this.keycodes = {
        8: "backspace",
        9: "tab",
        13: "enter",
        14: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "caps",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        44: "printscreen",
        45: "insert",
        46: "delete",
        48: "0",
        96: "0", //numpad
        49: "1",
        97: "1", //numpad
        50: "2",
        98: "2", //numpad
        51: "3",
        99: "3", //numpad
        52: "4",
        100: "4", //numpad
        53: "5",
        101: "5", //numpad
        54: "6",
        102: "6", //numpad
        55: "7",
        103: "7", //numpad
        56: "8",
        104: "8", //numpad
        57: "9",
        105: "9", //numpad
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scrolllock",
        186: "semicolon",
        187: "equals",
        189: "minus",
        188: "comma",
        190: "period",
        191: "forwardslash",
        219: "openbracket",
        220: "backslash",
        221: "closebracket",
        222: "quote"
    };
    
    /**
     * Start up on instantiation
     */
    
    this.init();   
    
};