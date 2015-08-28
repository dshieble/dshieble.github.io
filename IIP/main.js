

/*
    This section of the script is the map and svg stuff
*/
//Draw the Map using the MapBox Tiling - Do not change order here!
tiles = ['http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
         'http://{s}.tiles.mapbox.com/v3/danshiebler.lfa46a3b/{z}/{x}/{y}.png',
         'http://{s}.tiles.mapbox.com/v3/danshiebler.jc7h07lm/{z}/{x}/{y}.png',
         'http://{s}.tiles.mapbox.com/v3/danshiebler.ip7j62mf/{z}/{x}/{y}.png']

map = L.map('map').setView([31, 35], 6);
L.tileLayer(tiles[0], {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);



//SVG Object that D3 circles lie on top of
map._initPathRoot();
var svg = d3.select("#map").select("svg"),
    g = svg.append("g");

/*
    This section of the script is the variable declarations
*/
var location_dict = {};
//Stores a number of inscriptions in multiple hashes by city -> type -> language -> religion
var multiHash = {};
//stores sizes of location circles
var totalSizes = {};
var sizes = {};
//array of all currenty selected locations
var selected = []
//This array stores the unsimplified names of the location (unsimplified keys of location_dict) -> only locations that have books published in the current time period are included
var names = [];
var positions = [];
var polygons = [];

//Facets
var types = {};
var languages = {};
var religions = {};
var facets = [types, languages, religions];
var facet_names = ["Types", "Languages", "Religions"];

//https://raw.githubusercontent.com/dshieble/ExternalFiles/master/inscriptionData.json
var Json = "https://raw.githubusercontent.com/dshieble/External_Json_Files/master/coordinateJSON.json";
var HTMLJson = "https://raw.githubusercontent.com/dshieble/ExternalFiles/master/inscriptionData.json";

// var HTMLJson = "http://library.brown.edu/cds/projects/iip/api/?q=*%3A*&rows=1916&fl=inscription_id%2C+language%2C+city%2C+religion%2C+type&wt=json&indent=true";

// "http://library.brown.edu/cds/projects/iip/api/?q=*%3A*&rows=1916&fl=inscription_id%2C+language%2C+city%2C+religion%2C+type&wt=json&indent=true";


//Circles and circle manager variables
var circles = undefined;
var maker = undefined;

/*
    Load the JSON files
*/





//basic location rows
d3.json(Json, function(locations) {
    locations.rows.forEach(function(d,i) {
        simpName = simplify_string(d.name);
        location_dict[simpName] = d;
        multiHash[simpName] = {};
        names[i] = d.name.trim();
        //selected.push(names[i]);

        layer_point = map.latLngToLayerPoint(d.coordinates);
        positions[i] = [layer_point.x, layer_point.y];
    });
});


$.ajax({
   type: 'GET',
   url: 'proxy.php?url=http://anyDomain.com?someid=thispage',
   dataType: "json",
    success: function(data) {
        console.log(data)
        data.response.docs.forEach(function(d,i) {
            if (d.city == undefined) {
                return;
            } else {
                simpName = simplify_string(d.city);
            }
            if (multiHash[simpName] != undefined) {
                if (d.language == undefined || d.religion == undefined || d.type == undefined) {
                    return;
                } else {
                    t = typeMap(d.type[0])
                    l = d.language[0];
                    r = d.religion[0];
                    if (multiHash[simpName][t] == undefined) {
                        multiHash[simpName][t] = {};
                    }
                    if (multiHash[simpName][t][l] == undefined) {
                        multiHash[simpName][t][l] = {};
                    }
                    if (multiHash[simpName][t][l][r] == undefined) {
                        multiHash[simpName][t][l][r] = 0;
                    }
                    multiHash[simpName][t][l][r] ++;
                    if (types[t] == undefined) {
                        types[t] = true;
                    }
                    if (languages[l] == undefined) {
                        languages[l] = true;
                    }
                    if (religions[r] == undefined) {
                        religions[r] = true;
                    }
                }
            }
        });
        maker = new circleManager();
        //Circle size facets
        for (var f = 0; f < facets.length; f++) {
            string = "<div class=\"facet_div_child\"> " + facet_names[f] + "</br>";
            if (f != 0) {//"types" category needs a special case
                facet = facets[f];
                for (var key in facet) {
                    if (facet.hasOwnProperty(key)) {
                        string += "<label> <input type=\"checkbox\" id= \"" + key + "\" onclick=\"changeFacet(this.id, this.class)\" checked> " + getTitle(key) + " </label> </br>"
                    }
                }
                facet_div.innerHTML += string + "</div> </br>"
            } else {
                string += "<label> <input type=\"checkbox\" id= \"Funerary\" onclick=\"changeFacet(this.id, this.class)\" checked> " + "Funerary/Memorial" + " </label> </br>";
                string += "<label> <input type=\"checkbox\" id= \"Dedicatory\" onclick=\"changeFacet(this.id, this.class)\" checked> " + "Dedicatory" + " </label> </br>";
                string += "<label> <input type=\"checkbox\" id= \"Invocation\" onclick=\"changeFacet(this.id, this.class)\" checked> " + "Invocation" + " </label> </br>";
                string += "<label> <input type=\"checkbox\" id= \"Other\" onclick=\"changeFacet(this.id, this.class)\" checked> " + "Other" + " </label> </br>";
                facet_div.innerHTML += string + "</div> </br>";
            }
        }
        //Map Type Face
        string = "<div> Map Tiling </br>"
        checked = "checked"; //only first radio is checked
        for (var i = 0; i < tiles.length; i++) {
            string += "<label> <input type=\"radio\" name = \"tiling\" onclick=\"changeMapFacet("+i+")\" "+ checked +" > " + getMapTypeName(i) + " </label> </br>";
            checked = "";
        }
        map_type_div.innerHTML += string + "</div> </br>";
        updateSizes();
        for (var s in sizes) {
            if (sizes.hasOwnProperty(s)) {
                totalSizes[s] = sizes[s];
            }
        }
        writeSelected();
   }
});


function changeFacet(id) {
    for (var i = 0; i < facets.length; i++) {
        if (facets[i][id] != undefined) {
            facets[i][id] = document.getElementById(id).checked;
        }
    }
    reset_map();
} 

function changeMapFacet(i) {
    L.tileLayer(tiles[i], {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
    }).addTo(map);


}

function reset_map() {
    if (circles!=undefined) {
        maker.update();
    } else {
        console.log("Circles not initialized")
    }
};


/*
    All of the functions past this point are utility functions
*/


//Check membership in an array
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (simplify_string(a[i]) === simplify_string(obj)) {
            return true;
        }
    }
    return false;
}

//some regular expression magic to remove all spaces and commas from the Name id, and to make all letters lowercase
function simplify_string(string){
    if (string == undefined) {
        return undefined;
    }
    string = string.toString();
    string = string.replace(/ /g,'');
    string = string.replace(",",'');
    string = string.replace(";",'');
    string = string.replace("#",'');
    string = string.replace("?",'');
    string = string.replace(")",'');
    string = string.replace("(",'');
    string = string.replace("\'",'');
    string = string.replace("\"",'');
    string = string.replace("&",'');
    string = string.replace(".",'');
    string = string.replace("-",'');
    string = string.toLowerCase();
    return string;
}

function typeMap(t) {
    //Handling the enormous number of "types"
    if (t == "funerary" || t == "funerary.epitaph" || t == "memorial") { 
        return "Funerary";
    } else if (t == "dedicatory") {
        return "Dedicatory";
    } else if (t == "invocation") {
        return "Invocation";
    } else {
        return "Other";
    }
}

function sum(array){
    var count = 0;
    for (var i = array.length; i--;) {
        count += array[i];
    }
    return count;
}

//converts a number of inscriptions to a circle size
function num2size(num) {
    return num <= 0 ? 2 : Math.ceil(Math.log((num+1)*2),2)*2 + 1
}

//accepts the name of a location, returns number of inscriptions, privy to current settings
function getSize(location) {
    var simpName = simplify_string(location);
    var size = 0;
    for (var t in multiHash[simpName]) {
        if (types[t] == true) {
            for (var l in multiHash[simpName][t]) {
                if (languages[l] == true) {
                    for (var r in multiHash[simpName][t][l]) {
                        if (religions[r] == true) {
                            size += multiHash[simpName][t][l][r];
                        }
                    }
                }
            }
        }
    }
    return num2size(size);
}

//writes the contents of the selected array to the selected div
function writeSelected() {
    string = "Click on any locations to add them or remove them from your search. </br></br>";
    if (selected.length == 0) {
        string += "There are no locations selected";
    } else {
        string +=  "Scroll to see all selected locations. </br></br>";
    }
    for (var i = 0; i < selected.length; i++) {
        string += selected[i] + "</br>"
    }
    selected_div.innerHTML = string;

}


//returns the color of the input circle id, based on the different factors involved
function get_stroke(id) {
    if (contains(selected, simplify_string(id))) {
        return 4;
    } else {
        return 0;
    }
}

//returns the color of the input circle id, based on the different factors involved
function get_color(id) {
    return sizes[simplify_string(id)] <= 2 ? "black" : "blue";
}

function updateSizes() {
    for (var i = 0; i < names.length; i++) {
        name = simplify_string(names[i]);
        sizes[name] = getSize(name);
    }
}

//accepts an abbreviation like "grc", returns full name (Greek)
function getTitle(key) {
    switch(key) {
        case "grc": return "Greek";
        case "he": return "Hebrew";
        case "arc": return "Aramaic";
        case "la": return "Latin";
        case "x-unknown": return "Unknown";
        case "jewish": return "Jewish";
        case "other_religion": return "Other";
        case "christian": return "Christian";
        case "unknown_religion": return "Unknown";
        default: return key;
    }
}

//accepts a number, returns description of that map type
function getMapTypeName(i) {
    switch (i) {
        case 0: return "Pastel Map";
        case 1: return "Satellite Map";
        case 2: return "Regional Map";
        case 3: return "Topographical Map";

    }
}


function search() { 
    //only do anything IF something is checked in each field and a place is selected
    //"http://library.brown.edu/cds/projects/iip/search/?q=(city:jerusalem+AND+language:grc)+OR+place:caesarea:"

    if (selected.length == 0) {
        alert("Please select at least one location");
        return;
    }
    go = false;
    for (var i = 0; i < facets.length; i++) {
        go = false;
        for (var key in facets[i]) {
            if (facets[i][key] == true) {
                go = true;
                break;
            }
        }
        if (go == false) {
            break;
        }
    }
    if (!go) {
        return;
    } 
    string = "http://library.brown.edu/cds/projects/iip/search/?q=";
    string += "("
    for (var i = 0; i < selected.length; i++) {
        string += "city:" + selected[i] + "+OR+";
        string += "region:" + selected[i] + "+OR+";
    }      
    string+="city:none)+AND+("          
    for (var t in types) {
        if (types[t] == true) {
            if (t.indexOf("Fun") != -1) {
                string += "type:funerary+OR+";
                string += "type:funerary.epitaph+OR+";
                string += "type:memorial+OR+";
            } else {
                string += "type:" + simplify_string(t) + "+OR+";
            }
        }
    }
    string+="type:none)+AND+("          
    for (var l in languages) {
        if (languages[l] == true) {
            string += "language:" + l + "+OR+"
        }
    }
    string+="language:none)+AND+("
    for (var r in religions) {
        if (religions[r] == true) {
            string += "religion:" + r + "+OR+"
        }
    }
    string += "religion:none)"
    win = window.open(string);
}

// //selects all if 1, deselects all if 0
// function select_deselect_all(s) {
//     selected
//     for (e in circles) {
//         if (s == 1) {
//             d3.select(e)
//                 .style("fill", get_color(simplify_string(e.id)))
//                 .style("stroke-width", get_stroke(simplify_string(e.id)));
//         } 
//     }
//     writeSelected();

// }


/*
    circle manager object prototype - handles voronoi and circles stuff
*/

function circleManager(){

    //only call this once
    this.build = function() {
        this.makeCircles();
        map.on("viewreset", this.update);      
    }

    //tied to the build function
    this.update = function() {
        updateSizes();
        circles.attr("transform", function(n) { 
                layer_point = map.latLngToLayerPoint(location_dict[simplify_string(n)].coordinates);
                return "translate(" +
                layer_point.x +"," +
                layer_point.y +")";
        });

        text.attr("transform", function(n) { 
                layer_point = map.latLngToLayerPoint(location_dict[simplify_string(n)].coordinates);
                return "translate(" +
                layer_point.x +"," +
                layer_point.y +")";
        });

        circles.transition()
            //The transition takes one second
            .duration(1000)
            //Here we set the radius of the circle element
            .attr("r", function(n) { 
                //if there are no books at that place in the current parameter window - radius is 0
                return sizes[simplify_string(n)];
            });
        circles.style("fill", function(d) {return get_color(simplify_string(d))})
        circles.style("stroke-width", function(d) {return get_stroke(simplify_string(d))})

        if (map.getZoom() > 9) {
            text.style("opacity", 1)
        } else {
            text.style("opacity", 0)
        }
        writeSelected();
    }

    this.makeCircles = function() {
        updateSizes();

        text = g.selectAll("text")
                .data(names)
                .enter()
                .append("text")
                .text(function(d) {return d})
                .style("opacity", 0)
                .attr("transform", function(d,i) { 
                    return "translate(" + positions[i] + ")"; 
                });



        circles = g.selectAll("circle")
            .data(names
                //the circles' locations are determined here
                .sort(function(a, b) {
                    return b.size - a.size; 
                })
            )
            .enter()
            .append("circle")
            .attr("transform", function(d,i) { 
                return "translate(" + positions[i] + ")"; 
            })
            //Here we assign a class to the circle, which allows us to select it and change its color on mouseover later
            .attr('id',function(n,i){
                //Assign an id. 
                var id = n;
                return id;
            })
            .attr("r",0)
            .on('click',function(d) {circle_click(this)})
            .on('mouseover',function(d) {circle_mouseover(this)})//this.voronoi_mouseover)
            .on("mouseleave", function(d) {circle_mouseleave(this)})
            .style("opacity", .6)
            .style("stroke", 0)
            .style("stroke-width", 0)
        circles.transition()
            //The transition takes one second
            .duration(500)
            //Here we set the radius of the circle element
            .attr("r", function(n) { 
                //if there are no books at that place in the current parameter window - radius is 0
                return sizes[simplify_string(n)];
            });
        circles.style("fill", function(d) {return get_color(simplify_string(d))})
        circles.style("stroke-width", function(d) {return get_stroke(simplify_string(d))})

    }

    //Responds when voronoi is moused over
    circle_mouseleave = function (e) {
        color = get_color(simplify_string(e.id));
        d3.select(e)
            .style("fill", color)
        label.innerHTML = "Welcome to the IIP Visualizer";
    }

    //Responds when voronoi is moused over
    circle_mouseover = function (e) {
        d3.select(e)
            .style("fill", "red");
        var n = simplify_string(e.id);
        label.innerHTML = e.id + ": " + sizes[n] + " faceted inscriptions and " + totalSizes[n] + " total inscriptons";
    }

    //responds when circle is clicked - add or remove a circle from selected
    circle_click = function(e) {
        //TODO: go to the faceted string location - learn how to write the string query

        simp = e.id
        var index = selected.indexOf(simp);
        if (index != -1) {
            selected.splice(index, 1);
        } else {
            selected.push(simp);
        }
        writeSelected();
        d3.select(e)
            .style("fill", get_color(simplify_string(e.id)))
            .style("stroke-width", get_stroke(simplify_string(e.id)));
    }

    //Mainline
    this.build();

}