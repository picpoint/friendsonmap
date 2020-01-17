
new Promise((resolve) => {	                                                          	// создаём промис
  window.addEventListener('load', () => {		                                            // по событию загрузки страницы разрешаем промис
    resolve();
  });  
})
  .then(() => {		                                                                      // тогда 
    return new Promise((resolve, reject) => {		                                        // новый промис
      VK.init({		                                                                      // инициализируем вк по определённому ID
        apiId: 7250280
      });

      VK.Auth.login((response) => {		                                                  // авторизуемся
        //console.log(response);
        if(response.session) {                                                          // если прошла авторизация и сессия доступна
          resolve(response);                                                            // резолвим ответ          
        } else {
          reject(new Error(`***ERR TO AUTHORIZ***`));                                   // иначе ошибка авторизации
        }
      }, 2);	                                                                          // 2 - это передаваймый параметр, указывающий что нужен доступ к списку друзей
      
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {	                                          // тогда возвращаем новый промис
      VK.api('users.get', {v: '5.8', name_case: 'gen,city', fields: 'city'}, (response) => {	                // указываем версию апи и передача имени в родительном падеже
        //console.log(response);
        if(response.error) {                                                            // если промис не разрешился
          reject(new Error(response.error.error_msg));                                  // реджектим
        } else {          
          resolve(response);                                                            // резолвим ответ
          let myCity = response.response[0].city.title;
          //console.log(myCity);


          /******************GEOCODING STRAT*******************/


          ymaps.ready(init);

          function init() {
            var myMap = new ymaps.Map('map', {center: [45.04, 41.96], zoom: 15});
    
            ymaps.geocode(myCity, {        
                results: 1
            })
            .then(function (res) {              
              var firstGeoObject = res.geoObjects.get(0),                  
                coords = firstGeoObject.geometry.getCoordinates(),                  
                bounds = firstGeoObject.properties.get('boundedBy');
                firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');              
                firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());              
                myMap.geoObjects.add(firstGeoObject);              
                myMap.setBounds(bounds, {                  
                  checkZoomRange: true
                });            
            });
          }


          /******************GEOCODING END*******************/


        }
      });
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {                                            // возвращаем новый промис
      VK.api('friends.get', {v: '5.8', fields: 'photo_100,city'}, (response) => {             // передаём параметры для выгрузки фото 
        if(response.error) {                                                             // если ошибка ответа
          reject(new Error(response.error.error_msg));                                   // реджектим ответ  
        } else {
          resolve(response);                                                             // иначе респонсим ответ
        }
      });
    });
  })
  .then((response) => {                                                                  // читаем ответ    
    let friends = response.response.items;
    console.log(friends);

    for(let i = 0; i < friends.length; i++) {
      //console.log(friends[i]);
      if(friends[i].city) {        
        let cityOfFriend = friends[i].city.title;
        console.log(cityOfFriend);

        ymaps.ready(init);

          function init() {
            var myMap = new ymaps.Map('map', {center: [45.4, 41.96], zoom: 15});
    
            ymaps.geocode(cityOfFriend, {        
                results: 1
            })
            .then(function (res) {              
              var firstGeoObject = res.geoObjects.get(0),                  
                coords = firstGeoObject.geometry.getCoordinates(),                  
                bounds = firstGeoObject.properties.get('boundedBy');
                firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');              
                firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());              
                myMap.geoObjects.add(firstGeoObject);              
                myMap.setBounds(bounds, {                  
                  checkZoomRange: true
                });            
            });
          }


      }
    }

    

    
    // ymaps.ready(init);                                                                   // инициализируем переменную ymaps

    // function init() {      
    //   var myMap = new ymaps.Map("map", 
    //     {
    //       center: [45.04, 41.96], 
    //       zoom: 12
    //     }, 
    //     {
    //       searchControlProvider: 'yandex#search'
    //     });

    //   myPieChart = new ymaps.Placemark();

    //   myMap.geoObjects.add(myPieChart)
    //     .add(new ymaps.Placemark([45.04, 41.96], 
    //       {
    //         balloonContent: 'красная метка'
    //       }, 
    //       {
    //         preset: 'islands#icon', iconColor: 'red'
    //       }));        
    // }

    
  });