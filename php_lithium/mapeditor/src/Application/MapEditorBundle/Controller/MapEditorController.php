<?php

namespace Application\MapEditorBundle\Controller;

use Symfony\Framework\FoundationBundle\Controller;

class MapEditorController extends Controller
{
    public function indexAction()
    {
        return $this->render('MapEditorBundle:MapEditor:index', array());
    }

    public function mapAction()
    {
        return $this->render('MapEditorBundle:MapEditor:map', array());
    }
}
