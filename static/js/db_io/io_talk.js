export async function add_talk(name,message,time){
    try{
        const params= new URLSearchParams({
            name:name,
            message:message,
            time:time
        });
        // const url=`http://localhost:5000/api/add_talk?${params}`;
        const url=`http://192.168.1.105:5000/api/add_talk?${params}`;


        const response= await fetch(url,{
            method:'GET',
            mode:'cors',
            credentials:'include'
        });

        if (!response.ok){
            throw new Error("net error");
        }

        const data= await response.json();

        if (data.status==='success'){
            console.log("add success")
        }
        // console.log('get data:', data);
    }catch(error){
        console.error('fetch error:',error);
    }
}


export async function get_talk(){
    try{
        const url=`http://192.168.1.105:5000/api/get_talk`;

        const response=await fetch (url,{
            method:'GET',
            mode:'cors',
            credentials:'include'
        });
        const data=await response.json();

        // if(data.status==='success'){
        //     console.log("get talk success");
        // }
        console.log("get talk:",data);
    }
    catch(error){
        console.error('fetch error:',error)

    }

}
