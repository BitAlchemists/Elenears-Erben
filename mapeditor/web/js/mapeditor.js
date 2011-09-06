/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var mapheight = 400;
var mapwidth = 400;

function changeSize(width, height) 
{
    mapheight=mapheight+parseInt(width);
    mapwidth=mapwidth+parseInt(height);
    loadMap();
}

function setSize(width, height) 
{
    mapheight=parseInt(width);
    mapwidth=parseInt(height);
    loadMap();
}

function render_testmap($map){

    var get_fieldcolor = function(typ){
        /*
         * 1 => Wiese
         * 2 => Berg
         * 3 => Wasser
         *
         */
        switch (typ) {
            case 1:
                return "#A5BF36";
            case 2:
                return "#B7C3C3";
            case 3:
                return "#145678";
            default:
                return "#f00";
        }

    }
    var get_fieldname = function(typ){
        /*
         * 1 => Wiese
         * 2 => Berg
         * 3 => Wasser
         *
         */
        switch (typ) {
            case 1:
                return "Wiese";
            case 2:
                return "Berg";
            case 3:
                return "Wasser";
            default:
                return "Der Ort der niemals war";
        }

    }
    

    var paper = Raphael(document.getElementById("map"), mapwidth, mapheight);
    var f_width  = parseInt(mapwidth/25);
    var f_height = parseInt(mapheight/25);


    $.each($map, function(key, value){
        paper.rect(
            (value.x-1)*f_width,
            (value.y-1)*f_height,
            f_width,
            f_height
        ).attr(
            {fill: get_fieldcolor(value.typ), title: get_fieldname(value.typ)}
        ).hover(
            function(){
                $("#map_info").html("Feldname: "+ this.attr("title") );
            },function(){

            }
        );
    });

}

function loadMap ()
{
    document.getElementById("map").innerHTML='';
    $.get('map.json',
        {},
        function(data){
            render_testmap(data.map);
        },
        'json'
    )
} 
