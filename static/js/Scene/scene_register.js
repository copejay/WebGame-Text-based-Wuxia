
import InputRect from '/static/js/Scene/tool/regis_input.js'
import createButton from '/static/js/Scene/tool/button.js'


export class RegisterScene extends Phaser.Scene{
    constructor(){
        super('RegisterScene')

        // const screenWidth=window.innerWidth;
        // const screenHeight=window.innerHeight;
        // const gameRatio=920/1800;
        // this.gameWidth=null;
        // this.gameHeight=null;
        // if(screenWidth /screenHeight>gameRatio){
        //     this.gameHeight=screenHeight;
        //     this.gameWidth=this.gameHeight * gameRatio;
        // }else{
        //     this.gameWidth=screenWidth;
        //     this.gameHeight=this.gameWidth / gameRatio;
        // }

        // this.inputRect=new InputRect([this.gameWidth,this.gameHeight]);

    }

    preload(){
        this.load.image('register',"/static/PM_data/login.jpg");
    }

    create(){
        this.gameWidth=this.game.config.width;
        this.gameHeight=this.game.config.height;
        this.inputRect=new InputRect([this.gameWidth,this.gameHeight]);



        this.cameras.main.fadeIn(300,0,0,0);
        this.add.image(0,0,'register').setOrigin(0,0).setDisplaySize(this.gameWidth,this.gameHeight);
        this.inputRect.onClickLogin();

        // onClickLogin([this.gameWidth,this.gameHeight]);

        createButton(this.gameWidth*0.5,this.gameHeight*0.7,this.gameWidth*0.25,this.gameHeight/20,"返回",()=>{
            console.log("返回");
            this.scene.start('BeginScene');
            this.inputRect.remove();

        },this);





        

        // const fromData={};
       

    }

}