import event_bus from "/static/js/event_bus.js";

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

    create(){
        this.au_button= this.scene.add.container(this.x,this.y).setName(this.id);
        const background = this.scene.add.rectangle(0, 0,this.width, this.height, 0xe94560)
        .setInteractive()
        .on('pointerdown', () => {
            console.log("聊天内部点击");

            background.setFillStyle(0xca1f48); // 按下效果
            event_bus.emit("talk_begPop_talk",this.id);

        })
        .on('pointerup', () => background.setFillStyle(0xe94560))
        .on('pointerout', () => background.setFillStyle(0xe94560));
       
        this.au_button.add(background)
        let fontSize=Math.ceil(this.height*0.4);
        if (this.id=="X"){
            fontSize=Math.ceil(this.height*0.8);
        }

        this.text= this.scene.add.text(0,0,this.out_text,{
            fontSize:fontSize,
            color:"#fff",
            align:'center'
        });
        this.text.setOrigin(0.5);
        this.au_button.add(this.text);
    }

    re_text(text){
        this.id=text;
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
            console.log("talk click");
        });
    }

    // 添加删除方法
    destroy() {
        // 移除所有事件监听
        if (this.background) {
            this.background.off('pointerdown');
            this.background.off('pointerup');
            this.background.off('pointerout');
        }
        
        if (this.au_button) {
            this.au_button.off('pointerdown');
            // 从场景中移除容器及其所有子元素
            this.au_button.destroy({ children: true });
        }
        
        // 清理引用
        this.scene = null;
        this.background = null;
        this.text = null;
        this.au_button = null;
    }
}