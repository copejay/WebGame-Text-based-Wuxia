

export class AU_Button{
    constructor(x,y,width,height,id,scene){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.id=id;
        this.out_text=id;
        this.scene=scene;
        this.create();
        this.addListen();
    }

    preload(){
        this.scene.load.image("button","../PM_data/button2.jpg");
    }

    create(){
        this.au_button= this.scene.add.container(this.x,this.y).setName(this.id);
        const background=this.scene.add.sprite(0,0,"button");
        background.setDisplaySize(this.width,this.height);
        this.au_button.add(background)
        const fontSize=this.height*0.36
        this.text= this.scene.add.text(0,0,this.out_text,{
            fontSize:fontSize,
            color:"#fff",
            align:'center'
        });
        this.text.setOrigin(0.5);
        this.au_button.add(this.text);
    }

    re_text(text){
        this.text.setText(text);
    }

    disPlay(){
        this.au_button.setVisible(false);
    }

    run(){
        this.au_button.setVisible(true);
    }

    addListen(){
        this.au_button.setSize(this.width,this.height);
        this.au_button.setInteractive();
        this.au_button.on('pointerdown',()=>{
            // this.reNew();
            console.log("click");
        });
    }
}