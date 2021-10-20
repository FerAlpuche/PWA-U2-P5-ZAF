const CACHE_NAME = 'cache-v1';
const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

function cleanCache(cacheName,sizeItems){
    caches.open(cacheName).then((cache)=>{
        cache.keys().then(keys=>{
            console.log(keys);
            if (keys.length >= sizeItems){
                cache.delete(keys[0]).then(()=>{
                    cleanCache(cacheName,sizeItems);
                });
            }
        });
    });
}

self.addEventListener('install',(event)=>{
    console.log("SW: installed");

    // Se crea el caché 
    const promesaCache = caches.open(CACHE_STATIC_NAME).then((cache)=>{
        return cache.addAll([
            '/PWA-U2-P5-ZAF',
            '/PWA-U2-P5-ZAF/index.html',
            '/PWA-U2-P5-ZAF/css/page.css',
            '/PWA-U2-P5-ZAF/img/img1.jpg',
            '/PWA-U2-P5-ZAF/js/app.js',
            '/PWA-U2-P5-ZAF/img/img2.jpg',
            '/PWA-U2-P5-ZAF/pages/view-offline.html'
        ]);
    });

    const promeInmutable = caches.open(CACHE_INMUTABLE_NAME).then((cacheInmutable)=>{
        return cacheInmutable.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css'
        ]);
    });

    
    event.waitUntil(Promise.all([promesaCache,promeInmutable]));
})
// estrategia de cache 2
self.addEventListener('fetch',(event)=>{
    // Aui se busca en el cache y en caso de no encontrarlo se ira a la red 
    const respuestaCa = caches.match(event.request).then((res)=>{
        if (res){ // En caso de que el request este en elcaceh
            return res //respuesta con cache
        }

        console.log("El recurso no se encuentra en caché!",event.request.url);
        return fetch(event.request).then(resNet=>{
            // Aqui se abre el cache
            caches.open(CACHE_DYNAMIC_NAME).then(cache=>{

                cache.put(event.request,resNet).then(()=>{ // Se guarda la respuesta de la red en el caché
                    cache.put(event.request, resNet);
                    cleanCache(CACHE_DYNAMIC_NAME,7)
                })
            })
            return resNet.clone(); // Respuesta con el response de la red
        }).catch(() => {

            if(event.request.ur.includes(".jpg")){
                // Aquí retorna la imagen que deb aparecer cuando esta modo offline
                return caches.match("/PWA-U2-P5-ZAF/img/img2.jpg");
            }

        })
    })

    event.respondWith(respuestaCa);
})

/*self.addEventListener('fetch', (event) =>{
    //  Network with cache fallback
    
    const respuesta = fetch(event.request).then(res => {

        if(!res){
            return caches.match(event.request);
        }

        caches.open(CACHE_DYNAMIC_NAME).then(cache => {
            cache.put(event.request,res);
            cleanCache(CACHE_DYNAMIC_NAME, 5);
        });
        return res.clone();
    }).catch(error =>  {
        // Excepcion en fetch
        // trato de retornar algo que esta en elcache
        return caches.match(event.request);
    });

    event.respondWith(respuesta);

})*/