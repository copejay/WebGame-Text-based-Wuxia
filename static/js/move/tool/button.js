

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
        // const background=this.scene.add.sprite(0,0,"button");
        // background.setDisplaySize(this.width,this.height);
        const background=this.scene.add.graphics();
        background.fillStyle(0x000000,1);
        background.fillRect(-this.width/2,-this.height/2,this.width,this.height);

        this.au_button.add(background)
        let fontSize=Math.ceil(this.height*0.45);

        // if (this.id.length>=5){
        //     fontSize=Math.ceil(this.height*0.4);
        // }else{
        //     fontSize=Math.ceil(this.height*0.52);

        // }
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