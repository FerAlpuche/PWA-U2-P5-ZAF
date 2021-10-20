self.addEventListener('install', (event)=>{
    console.log('SW --> Instalado');
});

self.addEventListener('fetch', (event)=>{
    console.log('SW --> Fetch');
    console.log(event.request.url);

    const resOffFile = fetch('pages/view-offline.html');

    const res = fetch(event.request).catch(()=>{
        console.log("Error en elrequest")
        return resOffFile;
    })
    
    event.respondWith(res)
});