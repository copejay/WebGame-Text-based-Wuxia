

export class BeginScene extends Phaser.Scene{
    constructor(){
        super('BeginScene')


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
        // this.gameWidth=this.game.config.width;
        // this.gameHeight=this.sys.game.config.height;

    }

    preload(){
        this.load.image('login',"/static/PM_data/login.jpg");
        this.load.image('register',"/static/PM_data/login.jpg");
        this.load.image("button","/static/PM_data/back.png");
    }

    create(){
        this.gameWidth=this.game.config.width;
        this.gameHeight=this.game.config.height;
        this.add.image(0,0,'login').setOrigin(0,0).setDisplaySize(this.gameWidth,this.gameHeight);
        const math_size=Math.ceil(this.gameWidth/18);

        const helloText1=this.add.text(this.gameWidth*0.35,this.gameHeight*0.1,"Welcome to《封魔》",{

        fontSize:math_size,

        fill:'#ffffff',
        // backgroundColor:'#1c0303ff',
        // padding:{x:20,y:10}
    })
    .setOrigin(0.5)

        const helloText2=this.add.text(this.gameWidth*0.55,this.gameHeight*0.15,"developed by CopeJay",{
        fontSize:this.gameWidth/15,
        fill:'#ffffff',
        // backgroundColor:'#1c0303ff',
        // padding:{x:20,y:10}
    })
    .setOrigin(0.5)

        const beginButton=this.add.text(this.gameWidth/2,this.gameHeight*0.6,"登录",{
            fontSize:this.gameWidth/15,
            fill:'#ffffff',
            backgroundColor:'#1c0303ff',
            padding:{x:20,y:10}
        })
        .setOrigin(0.5)
        .setInteractive();
        
        beginButton.on('pointerdown',()=>{
            console.log("click begin Button");
            this.scene.start('LoginScene');
        })

        const registerButton=this.add.text(this.gameWidth/2,this.gameHeight*0.68,"注册",{
            fontSize:this.gameWidth/15,
            fill:'#ffffff',
            backgroundColor:'#1c0303ff',
            padding:{x:20,y:10}
        })
        .setOrigin(0.5)
        .setInteractive();
        
        registerButton.on('pointerdown',()=>{
            // console.log("click register Button");
            // this.cameras.main.fadeOut(200,0,0,0);
            // this.cameras.main.once('camerafadeoutcomplete',()=>{
            //     this.scene.start('RegisterScene');
            // })
            this.scene.start('RegisterScene');
        })
    }

    // update(){
    //     console.log("login updating..")
    // }
}