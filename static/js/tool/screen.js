class AU_Button{
    constructor(x,y,width,height,text,scene){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.text=text;
        this.scene=scene;
        this.preload();
        this.create();
        this.addListen();
    }

    preload(){
        this.scene.load.image("button","../PM_data/button.png");
    }

    create(){
        this.au_button= this.scene.add.container(this.x,this.y);
        const background=this.scene.add.sprite(0,0,"button");
        background.setCrop(0,0,this.width,this.height);
        this.au_button.add(background)
        this.text= this.scene.add.text(0,0,this.text,{
            fontSize:'24px',
            color:"#fff",
            align:'center'
        });
        this.text.setOrigin(0.5);
        this.au_button.add(this.text);
    }

    reNew(){
        const max = 10;
        const randomInt = Math.floor(Math.random() * max);
        this.text.setText(randomInt);
    }

    addListen(){
        this.au_button.setSize(this.width,this.height);
        this.au_button.setInteractive();
        this.au_button.on('pointerdown',()=>{
            this.reNew();
            console.log("click");
        });
    }
}

export class Screen{
    constructor(scene){
        this.width=60;
        this.height=60;
        this.scene=scene;
    }

    create(){
        console.log("screen");
        // this.upButton=new AU_Button(100,100,100,100,"up",this.scene);
        // this.downButton=new AU_Button(100,200,100,100,"down",this.scene);
    }
}