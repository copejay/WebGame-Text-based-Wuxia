
import { talkScreen } from '/static/js/inter_screen/talkScreen.js'
import { smallScreen } from '/static/js/inter_screen/smallScreen.js'

import { textScreen } from '/static/js/inter_screen/textScreen.js'
import { personScreen } from '/static/js/inter_screen/personScreen.js'
import { bloodScreen } from '/static/js/inter_screen/bloodScreen.js';
import { clickScreen } from '/static/js/inter_screen/clickScreen.js';
// import { allControlScreen } from '/static/js/inter_screen/allControlScreen.js';
import { acScreen } from '/static/js/inter_screen/acScreen.js';


import { PopScreen } from '/static/js/inter_screen/popScreen.js'






export class All_Screen{

    constructor(size,scene){

        this.talkScreen= new talkScreen(size,scene);
        this.smallScreen= new smallScreen(size,scene);

        this.textScreen= new textScreen(size,scene);
        this.personScreen= new personScreen(size,scene);
        this.bloodScreen= new bloodScreen(size,scene);
        this.clickScreen= new clickScreen(size,scene);
        this.all_control= new acScreen(size,scene);
        this.popScreen= new PopScreen(size,scene);

    }
    
    create(){
        this.talkScreen.create();
        this.smallScreen.create();

        this.textScreen.create();
        this.personScreen.create();
        this.bloodScreen.create();
        this.clickScreen.create();
        this.all_control.create();

        this.popScreen.create();
    }


}