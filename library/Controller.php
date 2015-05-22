<?php

class Controller extends Mem_cached {

    function __construct() {
      parent::__construct();
      $this->view = new View();
    }
    
   

}
