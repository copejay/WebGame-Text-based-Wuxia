import {nanjing_map, yangzhou_map,wanshou_map} from "./map.js";

import { AU_Button } from "./tool/button.js";
import eventBus from '../event_bus.js';

import PersonControl from "/static/js/inter_screen/bloodScreen_c/personControl.js"

// import {add_talk} from '../db_io/io_talk.js'
// import {get_talk} from '../db_io/io_talk.js'
import socket from '../db_io/io_socket.js'
import { listener } from "/static/js/db_io/listener.js";
import event_bus from "../event_bus.js";


export class Move{
    constructor(size,scene){
        console.log('Creating AU_Button with scene:', scene);
        this.size=size;
        this.scene=scene;
        this.site=[size[0]*0.5,size[1]*0.795];
        this.size_bt=[size[0]*0.17,size[1]*0.035]
        this.PersonSite=[14,18];
        this.map_dict={"扬州":[yangzhou_map,12,19],"南京":[nanjing_map,12,18],"万兽山脉":[wanshou_map,12,26]};

        this.map_name="扬州";
        this.map=yangzhou_map;
        this.listener=new listener();

        this.personControl=PersonControl;

        //注意先后顺序，在main函数里面的调用顺序
        // this.create();
        // this.add_listen();
    }


    create(){
        const timer = setTimeout(() => {
        // console.log("这个消息只会显示一次");
        this.move("down");
        // 这里可以写你需要执行的代码
        }, 500); // 时间单位是毫秒，3000表示3秒
        this.move_container= this.scene.add.container(0,0);

        this.move_to=[[0,0],[0,-1],[0,1],[-1,0],[1,0]];
        // this.up_dot= this.scene.add.text(0,0,"up",{
        //     fontSize:"16px",
        //     color:"#000",
        //     align:'center'
        // });
        // this.down_dot= this.scene.add.text(this.site[0]-100,this.size[1]-600,"down",{
        //     fontSize:"16px",
        //     color:"#000",
        //     align:'center'
        // });
        // this.up_dot=this.scene.add.text(0,0,"up")
        const width=this.size_bt[0];
        const height=this.size_bt[1];
        this.centerButton=new AU_Button(this.site[0],this.site[1],width*1.2,height*1.2,"center",this.scene);
        this.upButton=new AU_Button(this.site[0],this.site[1]-height*1.28,width,height,"up",this.scene);
        this.downButton=new AU_Button(this.site[0],this.site[1]+height*1.28,width,height,"down",this.scene);
        this.leftButton=new AU_Button(this.site[0]-width*1.21,this.site[1],width,height,"left",this.scene);
        this.rightButton=new AU_Button(this.site[0]+width*1.21,this.site[1],width,height,"right",this.scene);
        this.button_list=[this.centerButton,this.upButton,this.downButton,this.leftButton,this.rightButton];

        this.move_container.add(this.centerButton.au_button);
        this.move_container.add(this.upButton.au_button);
        this.move_container.add(this.downButton.au_button);
        this.move_container.add(this.leftButton.au_button);
        this.move_container.add(this.rightButton.au_button);

        this.add_listen();
        // const mapSite=this.PersonSite.toString();
        // console.log(this.map.get(mapSite));
        // this.move();
        this.leader(this.PersonSite);
        event_bus.on("function_move_run",(data)=>{
            this.run();
        })
        event_bus.on("function_move_destroy",(data)=>{
            this.destroy();
        })

    }


    run(){
        this.move_container.setVisible(true);
    }

    destroy(){
        this.move_container.setVisible(false);
    }



    // destroy_eventBus(){
    //     console.log("move:销毁eventBus");

    //     event_bus.off("Move");
    //     event_bus.off("Move_message");
    // }

    add_listen(){
        this.button_list.forEach((move_to,num)=>{
            // console.log(this.button_list[num]);
            let button=this.button_list[num].au_button;
            button.setInteractive();
            button.on("pointerdown",()=>{
                console.log("click down",button.name);
                if(this.personControl.check_busy()==false){
                    this.move(button.name);
                }else{
                    event_bus.emit("fight_message","你现在正忙着呢...");
                }
                // eventBus.emit('buttonClick',button.name);
            });
        });
        event_bus.on("Pop_f_fly",(map_name)=>{
            if(this.personControl.check_busy()==false){
                this.switch_map(map_name);
            }else{
                event_bus.emit("fight_message","你现在正忙着呢...");
            }
            // this.switch_map(map_name);
        })

        // event_bus.off("start_newScene");

        // event_bus.on("start_newScene",()=>{
        //     console.log("move destroy_eventBus");
        //     this.destroy_eventBus();
        // })

    }

    // busEmit(event_name,data){
    //     eventBus.emit(event_name,data);
    //     console.log("bus emit!!!");

    // }
    switch_map(map_name){
        this.map=this.map_dict[map_name][0];
        this.PersonSite=[this.map_dict[map_name][1],this.map_dict[map_name][2]];
        //负责提交给数据库，map和site的更新
        this.map_name=map_name;
        event_bus.emit("Move_renew_mapSite",[this.map_name,this.PersonSite[0],this.PersonSite[1]]);
        console.log("更新后的数据:", this.map, this.PersonSite);
        //因为center不会更新，所以fly的位置需要位于传送的下方
        this.move("up");
    }


    get_place(site){
        const place_site=site.toString();
        const place=this.map.get(place_site);
        const firstChar=place?place[0]:'';
        const num= parseInt(firstChar);
        // const num_place=place.slice(1);


        if (place){
            if (isNaN(num)){
                return ["text",place];
            }
            else{
                return [num,place.slice(1)];
            }
        }else{
            return false
        }
    }

    move(way){
        const move_way=way.toString();
        // this.busEmit("buttonClick",move_way);
        const site_list={center:[0,0],up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
        // this.move_to=[[0,0],[0,-1],[0,1],[-1,0],[1,0]];

        const NewPersonSite=[this.PersonSite[0]+site_list[move_way][0],this.PersonSite[1]+site_list[move_way][1]];

        const updatePlace=this.get_place(NewPersonSite);
        event_bus.emit("Move",updatePlace);
        console.log("move:",updatePlace);

        if(way=="center"){
            // add_talk("cj",updatePlace,666);
            socket.emit('client_message',"socket传输，点击中心处");
            event_bus.emit("Move_message",`你在原地打转。`);
        }else{
            if (updatePlace){
                event_bus.emit("move_to",`${updatePlace[1]}(${NewPersonSite})`);
                event_bus.emit("Move_message",`你来到了${updatePlace[1]}。`);
                event_bus.emit("Move_renew_mapSite",[this.map_name,NewPersonSite[0],NewPersonSite[1]]);
                // get_talk();
                this.PersonSite=NewPersonSite;
                if (updatePlace[0]=="text"){
                    this.leader(NewPersonSite);
                }else{
                    this.leaderNUM(NewPersonSite);
                }
            }
        }
    }
    

    leader(NewPersonSite){
        // event_bus.emit("Move_renew_mapSite",[this.map_name,NewPersonSite[0],NewPersonSite[1]]);
        this.move_to.forEach((move,num)=>{
        let branch_site=[NewPersonSite[0]+move[0],NewPersonSite[1]+move[1]];
        let branch_place=this.get_place(branch_site)
        // console.log(new_place);
        // console.log(`${num}:${move_to[0]},${move_to[1]}`);

        if(branch_place){
            if(branch_place[0]=="text"){
                this.button_list[num].re_text(branch_place[1]);
                console.log(`move:地图加载${branch_place}`);
                this.button_list[num].run();
            }
            else {
                if(branch_place[0]==num){
                    this.button_list[num].re_text(branch_place[1]);
                    this.button_list[num].run();
                }
                else{
                    this.button_list[num].re_text("空");
                    this.button_list[num].disPlay();
                }
            }
        }
        else{
            this.button_list[num].re_text("空");
            this.button_list[num].disPlay();
        }
    })
    }

    leaderNUM(NewPersonSite){
        this.move_to.forEach((move,num)=>{
            let branch_site=[NewPersonSite[0]+move[0],NewPersonSite[1]+move[1]];
            let center_place=this.get_place(NewPersonSite);
            // this.button_list[num].re_text(center_place[1]);
            // this.button_list[num].run();

            let branch_place=this.get_place(branch_site)
            if(branch_place){
                const num_dict={1:2,2:1,3:4,4:3};
                if(branch_place[0]=="text"){
                    // const num_dict={1:2,2:1,3:4,4:3};
                    if (num_dict[num]==center_place[0]){
                        this.button_list[num].re_text(branch_place[1]);
                        this.button_list[num].run();
                    }else{
                        this.button_list[num].re_text("空");
                        this.button_list[num].disPlay();
                    }
                }else{
                    if(branch_place[0]==num){
                        this.button_list[num].re_text(branch_place[1]);
                        this.button_list[num].run();
                    }
                    else if(center_place[0]==num_dict[num]){
                        this.button_list[num].re_text(branch_place[1]);
                        this.button_list[num].run();
                    }
                    else{
                        this.button_list[num].re_text("空");
                        this.button_list[num].disPlay();
                    }
                }
            }else{
                this.button_list[num].re_text("空");
                this.button_list[num].disPlay();
            }
            this.button_list[0].re_text(center_place[1]);
            this.button_list[0].run();
        })
    }



}