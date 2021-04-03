


mapboxgl.accessToken =
    'pk.eyJ1IjoibG9zdGJvcmRlcnMiLCJhIjoiY2toeDRrd3FhMGY2bjJ2bmI1ZWlzbDgxZyJ9.dF-ymmzKoC_HFXoTdHRf8Q';
var isopen = false;
var points;
var exists = false;
var map = new mapboxgl.Map({
    container: 'map-area',
    style: 'mapbox://styles/lostborders/ckhx4rhtv0i0319mo7vq3kqee',
    center: [5.570046944529395, 51.296005097134326], // starting position [lng, lat]
    zoom: 9,
    minZoom: 8,
    
    "layers": [
        {
          "id": "admin",
          "source": "mapbox.mapbox-streets-v8",
          "source-layer": "admin",
          "type": "fill",
         
        }
      ]
});
map.on('load', getData);
map.doubleClickZoom.disable();

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();

    
    for (const row of data) {
        var el = document.createElement('div');
        el.className = 'marker';
        el.id = 'marker';
        el._id = row.cardId
        console.log(el._id);
            if(window.location.pathname == '/create.html'){
            new mapboxgl.Marker(el)
                .setLngLat([row.lng, row.lat])
                .setPopup(new mapboxgl.Popup({
                        offset: 25
                    })
                    .setHTML(
                        
                        '<div class="cardheader" id="cardheader">' +
                        '<p id="cd_Naam" class="header">' + row.cardNaam + '</p></br></div>' +
                    

                        '<h3> Nr:</h3>' + row.cardNr + ' <p id="cd_Nr"></p></br>' +
                        '<h3> Opdrachtgever: </h3><p id="cd_Opdracht">' + row.cardOpdrachtgever + '</p></br>' +
                        '<h3> Architect: </h3><p id="cd_Architect">' + row.cardArchitect + '</p></br>' +
                        '<h3> Segment: </h3><p id="cd_Segment">' + row.cardSegment + '</p></br>' +
                        '<h3> Jaar: </h3><p id="cd_Jaar">' + row.cardJaar + '</p></br>' +
                        '<h3> Omzet: </h3><p id="cd_Omzet">' + row.cardOmzet + '</p>' +
                        '<p id="cd_Id" style="visibility: hidden;">'+row.cardId+'</p></br>' +
                        '<img class="markerimg" src="' + row.cardImage + '"> </img>' +
                        '<div class="markerimg-cover"><p class="seemoreimg" onclick="openImages()">&hellip;</p></div>'+
                        '<button class="cardbtn" id="btndelete">Delete</button>' +
                        '<button class="cardbtn" id="btnedit">Edit</button>'))

                .addTo(map);

            }
            else{
                new mapboxgl.Marker(el)
                .setLngLat([row.lng, row.lat])
                .setPopup(new mapboxgl.Popup({
                        offset: 25
                    }).setHTML(
                        
                        '<div class="cardheader" id="cardheader">' +
                        '<p id="cd_Naam" class="header">' + row.cardNaam + '</p></br></div>' +
                    

                       
                        '<h3> Opdrachtgever: </h3><p id="cd_Opdracht">' + row.cardOpdrachtgever + '</p></br>' +
                        '<h3> Architect: </h3><p id="cd_Architect">' + row.cardArchitect + '</p></br>' +
                        '<h3> Segment: </h3><p id="cd_Segment">' + row.cardSegment + '</p></br>' +
                        '<h3> Jaar: </h3><p id="cd_Jaar">' + row.cardJaar + '</p></br>' +
                        '<h3> Omzet: </h3><p id="cd_Omzet">' + row.cardOmzet + '</p>' +
                        '<p id="cd_Id" style="visibility: hidden;">'+row.cardId+'</p></br>' +
                        '<img class="markerimg" src="' + row.cardImage + '" onclick="openImages()" > </img>'))

                .addTo(map);
            }
                    var parse = row.cardCoords.replace(/"/g,"");
                    var coords = JSON.parse(parse);
               
                map.addSource(row.cardNaam, {
                    'type': 'geojson',
                    'data': {
                    'type': 'Feature',
                    'geometry': {
                    'type': 'Polygon',
                    "properties": {},
                    'coordinates': [
                        coords
                    ]
                    }
                    }
                    });
                    map.addLayer({
                    'id': row.cardNaam,
                    'type': 'fill',
                    'source': row.cardNaam,
                    'layout': {},
                    'paint': {
                    'fill-color': '#088',
                    'fill-opacity': 0.8
                    }
                    });

        


        switch (row.cardSegment) {
            case "Woningbouw":
                el.style.background = "purple";
                break;

            case "Kantoor":
                el.style.background = "#f84";
                break;

            case "School":
                el.style.background = "blue";
                break;

                case "Industrie":
                    el.style.background = "#e45";
                    break;

                    case "Zorg":
                        el.style.background = "#c34";
                        break;
        };

        

    }
    }


async function openImages() {
    var modal = document.getElementById('modal');
   
    var box = document.createElement('div');
    box.id = 'modal-images';
    box.className = 'modal-images';
    document.querySelector('.modal-content').appendChild(box);

    var modalimage = document.getElementById('modal-images');
    var item = document.getElementById('cd_Id').innerHTML;
    modal.style.display = 'block';

    const imageres = await fetch('/getimages/' + item);  
    const imagedata = await imageres.json();
    if(imagedata.length > 0){
        for(const image of imagedata){
            
            
            var createimg = document.createElement('img');
            createimg.src = image.imagePath;
            createimg.className = createimg.id = "moreimg-img";
            modalimage.appendChild(createimg);

        }
    }

    else{
        var createtext = document.createElement('h1');
        
        createtext.innerHTML = "No Images Available";
        modalimage.append(createtext);
    }
}



document.addEventListener('click', function (e) {
console.log(e.target);
    
    

    if(e.target && e.target.id == 'btnedit'){
        EditItem(e);
    }
    if(e.target.id == 'btndelete'){
        DeleteItem(e);
    }

   

    if(e.target.id == 'marker' && window.location.pathname == '/create.html'){
      
    }
    if(e.target.className == 'modal' || e.target.className == 'modal-images' || e.target.className == 'modal-content'){
        document.getElementById('modal').style.display = 'none';
        document.querySelector('.modal-images').remove();
        
    }

    if(e.target.id == 'dragmarker'){
       
        DragMarker(e);
        e.target.style.pointerEvents = "none";
        e.target.style.visibility = "hidden";
       
       
    }

    if(e.target.id == 'arrowhide'){
       var x = document.getElementById('arrowhide');
      
       var z = document.getElementById('createform');

       if (x.classList.contains('right')){
        x.classList.remove('right');
        x.classList.add('left');
        z.classList.remove('slideleft');
        z.classList.add('slideright');
       

   }
       else if (x.classList.contains('left')){
            x.classList.remove('left');
            x.classList.add('right');
            z.classList.remove('slideright');
            z.classList.add('slideleft');
           
       }

     
    }

});

function DragMarker(){
    
    var marker = new mapboxgl.Marker({
        draggable: true
        })
        .setLngLat([5.570046944529395, 51.296005097134326])
        .addTo(map);
        
        function onDragEnd() {
            var lngLat = marker.getLngLat();
            var lng = JSON.stringify(lngLat.lng);
            var lat = JSON.stringify(lngLat.lat);
            document.getElementById('cdLng').value = lng;
            document.getElementById('cdLat').value = lat;
            
        }
        
        marker.on('dragend', onDragEnd);
}

function DeleteItem(e){
    var item = {"cardId" : document.getElementById('cd_Id').innerHTML};
   
    if (confirm('Are you sure you want to delete this item?')) {
            return fetch('/delete', {
              method: 'delete',
              body: JSON.stringify(item),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            })
            .then(location.reload());
        
          
      } else {
        // Do nothing!
     
      }
}




function EditItem(e){
    var cardid = document.getElementById('cd_Id');
   var naam = document.getElementById('cd_Naam');
   var nr = document.getElementById('cd_Nr');
   var opdracht = document.getElementById('cd_Opdracht');
   var architect = document.getElementById('cd_Architect');
   var segment = document.getElementById('cd_Segment');
   var jaar = document.getElementById('cd_Jaar');
   var omzet = document.getElementById('cd_Omzet');
   
   naam.contentEditable = true;
   nr.contentEditable = true;
   opdracht.contentEditable = true;
   architect.contentEditable = true;
  segment .contentEditable = true;
   jaar.contentEditable = true;
   omzet.contentEditable = true;

  
  if(e.target.innerText == 'Edit'){
      e.target.innerText = 'Save';
      e.target.style.background = 'white';
      e.target.style.color = '#e1b608';
      e.target.style.border = '1px solid #e1b608';
      
  }

  else if(e.target.innerText == 'Save'){
    const data = 
        [naam.innerHTML,
        nr.innerHTML,
        opdracht.innerHTML,
        architect.innerHTML,
        segment.innerHTML,
        jaar.innerHTML,
        omzet.innerHTML,
        cardid.innerHTML];
    console.log(data);
     fetch('/update', {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        
      }
    
    })
        .then(checkStatus)
        .then((res)=>{location.reload()});
        
  }

 
 
 

}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

// get lang lat at click location




if (window.location.pathname == '/create.html') {
    var draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });
    map.addControl(draw);

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    function updateArea(e) {
        if (window.location.pathname == '/create.html') {
            var x = document.getElementById('formcoords');
            var data = draw.getAll();
            points = JSON.stringify(data.features[0].geometry.coordinates[0]);
            x.value = points;
        }
    }
};

