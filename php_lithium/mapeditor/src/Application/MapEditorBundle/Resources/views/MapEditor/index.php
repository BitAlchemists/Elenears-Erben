<?php $view->extend('MapEditorBundle::layout') ?>
<?php $view->javascripts->add('js/jquery-1.4.2.js');?>
<?php $view->javascripts->add('js/raphael.js');?>
<?php $view->javascripts->add('js/mapeditor.js');?>

      Mapedit: <a onclick="loadMap();false;" href="#">Laden</a> <br/>
      Zoom: 
          <a onclick="changeSize(-200,-200);" href="#">--</a>
          <a onclick="changeSize(-50,-50);" href="#">-</a>
          <a onclick="changeSize(50,50);" href="#">+</a>
          <a onclick="changeSize(200,200);" href="#">++</a><br/>
      Zoom: 
            <a onclick="setSize(50,50);" href="#">25%</a> 
            <a onclick="setSize(100,100);" href="#">50%</a> 
          <a onclick="setSize(200,200);" href="#">100%</a>
          <a onclick="setSize(400,400);" href="#">200%</a>
          <a onclick="setSize(800,800);" href="#">400%</a>
          <a onclick="setSize(1600,1600);" href="#">800%</a><br/>
      <br/>
      <div id="map_info"></div>

      <div id="map"></div>
