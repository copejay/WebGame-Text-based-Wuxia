

socket.on('connect',()=>{
    console.log('WebSocket 连接成功');
});

socket.on('disconnect',()=>{
    console.log('WebSocket 连接断开');
});

export default socket;