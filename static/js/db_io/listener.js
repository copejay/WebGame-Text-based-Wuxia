import event_bus from "/static/js/event_bus.js";
import socket from "/static/js/db_io/io_socket.js";

// 把listener挂在move下面
export class listener{

    constructor(){
        this.listen_character_info();
        this.update_backpack();
        this.update_bagMagic();
        this.listen_talk();
        this.listen_talk_cloud();
        this.listen_server();
        this.listen_lowNpc_cloud();
        this.listen_person();
        this.listen_localDb();
        this.listen_localDb_search();
        this.listen_localDb_site();
        this.listen_search_room_other();

        // const timer=setInterval(()=>{
        //     this.listen_character_info();
        // },60000);
        const loading_begin=setTimeout(()=>{
            //talk面板的信息更新是挂在人物更新一块的
            console.log("listen:初始化，加载人物信息");
            socket.emit("ask_character_info","");
        },600);

        const auto_search=setInterval(()=>{
            // console.log("自动查看周围玩家...");
            this.auto_search_room_other();
        },1000);
    }

//前端-listen消息格式，模块+具体要求
//listen-前端通信格式，gift+模块+具体信息


//listen-后端通信格式，ask+具体要求
//后端-listen,response+具体信息

//自动更新设置在listen里面，收到信息则对localDb进行更新
//localDb只对listen设置主动权限，对下级模块只接收被动更改和被动查询

//############################
//
//云服务器，自动发送区
//
//#####################

    auto_search_room_other(){
        socket.emit("ask_search_room_other");
    }


//############################
//云服务器-监听区
//
//
//#####################################

    listen_search_room_other(){
        socket.off("response_search_room_other");
        socket.on("response_search_room_other",(data)=>{
            if(data.code==0){
                console.log(`listen:监听到【服务器回复】地图信息${data.code}`);
                event_bus.emit("gift_search_room_other",data.data)
            }else if(data.code==1){
                // console.log("listen:监听到【服务器回复】地图信息为空");
                event_bus.emit("gift_search_room_other","None");
            }
        })
    }

    listen_character_info(){
        socket.off("response_character_info");
        // socket.emit("ask_character_info");
        socket.on("response_character_info",(data)=>{
            // event_bus.emit("update_userNews",data.data);
            event_bus.emit("gift_person_base_data",data.data);
        });
    }

    update_bagMagic(){
        socket.off("response_bagMagic");
        // socket.emit("ask_bagMagic_info");
        socket.on("response_bagMagic",(data)=>{
            if(data.code==0){
                console.log(`listen:监听到【服务器回复】武功信息${data.data}`);
                event_bus.emit("gift_bagMagic",data.data)
            }else if(data.code==1){
                console.log("listen:监听到【服务器回复】武功信息为空");
            }
        })
    }

    update_backpack(){
        socket.off("response_backpack");
        socket.on("response_backpack",(data)=>{
            if(data.code==0){
                console.log("listen:监听到【服务器回复】背包信息");
                event_bus.emit("gift_backpack",data.data);
            }
            else if(data.code==1){
                console.log("listen:监听到【服务器回复】背包信息为空");
            }
        })
    }

    listen_server(){
        socket.on("order_to_onePlayer",(data)=>{
            const order=data.order;
            if (order=="you_ara_out"){
                // socket.emit("ask_reconnect");
                alert("你已离线，刷新网页重新登录");
            }
        });

        socket.on("check_online",(data)=>{
            socket.emit("check_online_over",data);
        });

        socket.on("order_to_allPlayer",(data)=>{
            console.log("listen:监听到服务器全局命令！！！")
            console.log(`listen:收到的数据${data.data}`);

            event_bus.emit(`${data.order}`,data.data)
        })
    }

    listen_lowNpc_cloud(){
        socket.on("response_lowNpc_info",(data)=>{
            console.log(`接收到lowNpc信息${data.data}`);
            event_bus.emit("gift_lowNpc_info",data.data);
        })
    }

    listen_talk_cloud(){
        socket.off("response_talk");
        socket.on("response_talk",(data)=>{
            console.log(data);
        });
    }

    // update_character()

//############################
//
//本地监听区
//
//
//#################

    listen_localDb(){
        event_bus.on("localDb_renew_db",(data)=>{
            console.log("listen:监听到数据库更新请求");
            if (data.type=="person_base_data"){
                socket.emit("ask_renew_db",{type:"person_base_data",data:data.data});
            }else if(data.type=="backpack"){
                console.log("listener:收到更新背包信息")
                socket.emit("ask_renew_db",{type:"backpack",data:data.data});
            }
            else if(data.type=="bagMagic"){
                console.log("listener:收到更新武功信息")
                //add，up，del，除了up需要传入武功和num，其他都只需要传入武功
                if (data.act=="add"){
                    socket.emit("ask_renew_db",{type:"add_bagMagic",data:data.data});
                }else if(data.act=="up"){
                    socket.emit("ask_renew_db",{type:"up_bagMagic",data:data.data});
                }else if(data.act=="del"){
                    socket.emit("ask_renew_db",{type:"del_bagMagic",data:data.data});
                }
            }
        })
    }

    listen_localDb_site(){
        event_bus.on("localDb_insert_myMapSite",(data)=>{
            console.log("listen:监听到数据库更新地图位置请求");
            let map_name=data["map_name"]
            let x=data["x"]
            let y=data["y"]
            socket.emit("ask_insert_myMapSite",{"map_name":map_name,"x":x,"y":y});
        })
    }

    listen_localDb_search(){
        event_bus.on("localDb_search",(data)=>{
            console.log("listen:监听到数据库搜索请求");
            if (data.type=="person_base_data"){
                // socket.emit("ask_search_db",{type:"person_base_data",data:data.data});
                socket.emit("ask_character_info","");
            }else if(data.type=="backpack"){
                console.log("listener:收到搜索背包信息")
                socket.emit("ask_backpack_info","");
            }else if(data.type=="bagMagic"){
                console.log("listener:收到搜索武功信息")
                socket.emit("ask_bagMagic_info","");
            }
        })
    }


    listen_talk(){
        // socket.off("response_talk");
        // socket.on("response_talk",(data)=>{
        //     console.log(data);
        // });
        event_bus.on("Talk_input_message",(data)=>{
            console.log("listener:输入监听事件触发，输入内容为：",data);
            socket.emit("ask_input_message",data);
        })
    }

    // listen_server(){
    //     socket.on("order_to_onePlayer",(data)=>{
    //         const order=data.order;
    //         if (order=="you_ara_out"){
    //             // socket.emit("ask_reconnect");
    //             alert("你已离线，刷新网页重新登录");
    //         }
    //     });

    //     socket.on("check_online",(data)=>{
    //         socket.emit("check_online_over",data);
    //     });

    //     socket.on("order_to_allPlayer",(data)=>{
    //         console.log("listen:监听到服务器全局命令！！！")
    //         console.log(`listen:收到的数据${data.data}`);

    //         event_bus.emit(`${data.order}`,data.data)
    //     })
    // }

    listen_person(){
        this.All_name_list=[];

        event_bus.on("Person_beg_lowNpc_info",(name_list)=>{
            console.log("listen:监听到lowNPC信息请求");
            // let second= now.getSeconds();
            this.All_name_list.push(name_list);

        })

        setInterval(()=>{
            console.log("定时器工作:开始");
            // event_bus.emit("Move_message","定时器验证消息");
            if (this.All_name_list.length>0){
                //这里出现过一个诡异的bug，all_name_list无法被操作，下面的验证消息不断重复运行，但是无法发起socket请求
                //手机端更新chrome浏览器之后神奇的自己修复了，。。。
                //猜测可能是at(-1)调用错误的问题
                // event_bus.emit("Move_message","成功进入内部判断");
                console.log("定时器工作:发起lowNPC请求")
                let name_list=this.All_name_list.at(-1);
                this.All_name_list=[];
                socket.emit("ask_lowNpc_info",name_list);
            }
        },1000)

        
        // socket.on("response_lowNpc_info",(data)=>{
        //     console.log(`接收到lowNpc信息${data.data}`);
        //     event_bus.emit("gift_lowNpc_info",data.data);
        // })
    }

    broad_server(){

    }

    broad_user(){

    }


}