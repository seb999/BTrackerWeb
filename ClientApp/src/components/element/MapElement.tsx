import * as React from 'react';
import * as ol from 'ol';
import * as proj from 'ol/proj';
import * as geom from 'ol/geom';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import * as style from 'ol/style';

interface Props {
    gpsPositionList: Array<any>;
}

interface State {
}

class MapElement extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
    }

    render() {
   
        
       
        if (this.props.gpsPositionList.length != 0) {

   

            var navigationWayPoint = [] as any;

            var baseMapLayer = new layer.Tile({
                source: new source.OSM()
            });

            var map = new ol.Map({
                target: 'myMap',
                layers: [baseMapLayer],
            });

            var num = map.getLayers();
            num.forEach(element => {
                map.removeLayer(element);
            });

            var map = new ol.Map({
                target: 'myMap',
                layers: [baseMapLayer],
                view: new ol.View({
                    center: proj.fromLonLat([18.07308972, 59.2558675]),
                    zoom: 5 //Initial Zoom Level
                })
            });

            //Add way point
           
            this.props.gpsPositionList.forEach(item => {
                //Adding a marker on the map
                var marker = new ol.Feature({
                    name: "toto",
                    geometry: new geom.Point(
                        proj.fromLonLat([item.gpsPositionLongitude, item.gpsPositionLatitude])
                    ),  // Cordinates of New York's Town Hall
                });

                marker.setStyle(new style.Style({

                    image: new style.Icon(({
                        color: '#ffcd46',
                        crossOrigin: 'anonymous',
                        src: require("./../../images/marker.png"),
                    }))
                }));
                navigationWayPoint.push(marker);
            });

            var vectorSource = new source.Vector({
                features: navigationWayPoint
            });
            var markerVectorLayer = new layer.Vector({
                source: vectorSource,
            });

           
        

            
            map.addLayer(markerVectorLayer);
        };









    //   map.on('click', function(evt) {
    //     var feature = map.forEachFeatureAtPixel(evt.pixel,
    //       function(feature) {
    //         console.log("click");
    //         return feature;
    //       });
    //     if (feature) {
    //       console.log("click");
    //      }
    //   });





return (
    <div id="myMap"></div>
);
    }
}

export default MapElement