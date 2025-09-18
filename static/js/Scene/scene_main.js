

import { All_Screen } from '/static/js/inter_screen/all_screen.js';
// import {personScreen} from '/static/js/inter_screen/personScreen.js';
import {Move} from '/static/js/move/move.js';




export class MainScene extends Phaser.Scene{
    constructor(){
        super('MainScene');

        // const screenWidth=window.innerWidth;
        // const screenHeight=getRealViewportHeight();


        // const gameRatio=920/1800;
        // let gameWidth,gameHeight;

        // if(screenWidth /screenHeight>gameRatio){
        //     gameHeight=screenHeight;
        //     gameWidth=gameHeight * gameRatio;
        // }else{
        //     gameWidth=screenWidth;
        //     gameHeight=gameWidth / gameRatio;
        // }
        // this.talkScreen=new talkScreen([gameWidth,gameHeight],this);
        // this.textScreen=new textScreen([gameWidth,gameHeight],this);
        // const gameWidth=this.game.config.width;
        // const gameHeight=this.game.config.height;

        // this.All_Screen= new All_Screen([gameWidth,gameHeight],this);
        // this.personScreen=new personScreen([gameWidth,gameHeight],this);
        // this.move=new Move([gameWidth,gameHeight],this);
        // this.clickScreen=new clickScreen([gameWidth,gameHeight],this);
    }
    
    
    preload(){
        console.log("Preloading...");
        this.load.image("button","/static/PM_data/back.png");
        
    }

    create(){
        this.gameWidth=this.game.config.width;
        this.gameHeight=this.game.config.height;

        this.All_Screen= new All_Screen([this.gameWidth,this.gameHeight],this);
        this.move=new Move([this.gameWidth,this.gameHeight],this);



        console.log("Creating...");
        // this.screen.create();
        // this.talkScreen.create();
        // this.textScreen.create();
        this.All_Screen.create();
        // this.personScreen.create();
        this.move.create();

        // this.clickScreen.create();
        
    }

    // update(){
    //     console.log("UpDating...");
    // }
}

