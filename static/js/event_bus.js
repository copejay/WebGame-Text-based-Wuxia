
class EventBus{
    constructor(){
        this.events={};
    }

    on(eventName,callback){
        if(!this.events[eventName]){
            this.events[eventName]=[];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName,data){
        if(this.events[eventName]){
            this.events[eventName].forEach(callback=>{
                callback(data);
            });
        }
    }

    
    off(eventName,callback){
        if(this.events[eventName]){
            // 如果没有提供callback，移除该事件的所有监听
            if (!callback) {
            this.events[eventName] = [];
            } else {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
            }
        }
        // if(this.events[eventName]){
        //     this.events[eventName]=this.events[eventName].filter(cb=>cb !==callback);
        // }
    }

    once(eventName, callback){
    const wrapper = (data) => {
        callback(data);
        this.off(eventName, wrapper); // 触发一次就移除
    };
    this.on(eventName, wrapper);
}
}

export default new EventBus();