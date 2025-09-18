
import socket from '/static/js/db_io/io_socket.js'

function getRealViewportHeight(){
    console.log("innerHeight:");
    console.log(window.innerHeight || document.documentElement.clientHeight);
    console.log("clientHeight:");
    console.log(window.screen.availHeight);

    return Math.min(
        window.innerHeight || document.documentElement.clientHeight,
        // window.screen.availHeight
    );
}

function getRealWH(){
    const screenWidth=window.innerWidth;
    const screenHeight=getRealViewportHeight()

    const gameRatio=920/1800;
    let gameWidth,gameHeight;

    if(screenWidth /screenHeight>gameRatio){
        gameHeight=screenHeight;
        gameWidth=gameHeight * gameRatio;
    }else{
        gameWidth=screenWidth;
        gameHeight=gameWidth / gameRatio;
    }
    return [gameWidth,gameHeight];
}

let gameWidth=getRealWH()[0];
let gameHeight=getRealWH()[1];


import {MainScene} from './Scene/scene_main.js'
import {BeginScene} from './Scene/scene_begin.js'
import {LoginScene} from './Scene/scene_login.js'
import {RegisterScene} from './Scene/scene_register.js'
import {CharacterScene} from './Scene/scene_character.js'

// import rexuipluginMin from '../cool_ku/rexuiplugin.min.js';


const MyConfig={
    // type:Phaser.WEBGL,
    type:Phaser.WEBGL,
    scale:{
        mode:Phaser.Scale.FIT,
        parent:"FM_OL",

        width:gameWidth,
        height:gameHeight
    },

    width:gameWidth,
    height:gameHeight,
    backgroundColor: 0xFFFFE0,
    parent:"FM_OL",

    // fullscreenTarget:"FM_OL",

    // scale:{
    //     mode:Phaser.Scale.FIT,
    //     autoCenter:Phaser.Scale.CENTER_BOTH,
    //     width:gameWidth,
    //     height:gameHeight

    // },
    scene:[BeginScene,LoginScene,RegisterScene,MainScene,CharacterScene],

};


// console.log(window.rexuiplugin);
// window.addEventListener('DOMContentLoaded',()=>{
//     if(document.getElementById('FM_OL')){
//         new Phaser.Game(MyConfig);
//     }else{
//         console.error('FM_OL not found');

//     }
// });


const FM_OL=new Phaser.Game(MyConfig);

let run_num=0;

// window.addEventListener('resize',()=>{
//     if(run_num==0){
//         run_num++;

//     socket.emit('client_message',{
//         message:'检测到 resize!!!'
//     })

//     const wh=getRealWH();
//     FM_OL.scale.resize(wh[0],wh[1]);
// }
// })

