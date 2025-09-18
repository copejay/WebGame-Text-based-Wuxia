
export class Rectangle{
    constructor(x,y,width,height,scene){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.scene=scene;
        this.create();
    }

    create(){
        this.rectangle=this.scene.add.graphics().lineStyle(1,0xff0000).strokeRect(this.x,this.y,this.width,this.height);
        this.rectangle.fillStyle(0xFFFFE0,0.9);
        this.rectangle.fillRect(this.x,this.y,this.width,this.height);
        // this.rectangle.setDepth(1); 

    }
}