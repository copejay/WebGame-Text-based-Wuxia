const version = Date.now();

const resources=[
    {type:'script', src: `static/js/game_main.js?v=${version}`},
    {type:'style',  href: `static/css/main_style.css?v=${version}`}
];

function loadResource(resource){
    return new Promise((resolve,reject)=>{
        if (resource.type === 'script'){
            const script= document.createElement('script');
            script.type= 'module';
            script.src= resource.src;
            script.onload= resolve;
            script.onerror= reject;
            document.head.appendChild(script);
        }else if (resource.type === 'style'){
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = resource.href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        }
    });
}

async function loadAllResources(){
    try{
        for (const resource of resources){
            await loadResource(resource);
            console.log(`Success loading: ${resource.src || resource.href}`);
        }
        console.log('all resource loading over');
    }catch (error){
        console.error('resource loading fail:', error);
    }
}

loadAllResources();