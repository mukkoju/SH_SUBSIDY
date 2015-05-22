<?php

class Bootstrap {
    
    function __construct() {
       $temp_url = strtolower(trim($_SERVER['REQUEST_URI'], '/'));
       $url = explode('/', $temp_url);
       
       if(empty($url[0]) || $url[0] == 'index'){
           require APP_PATH . '/controllers/index.php';
           $controller = new Index();
           $controller->index();
       }
        
    }
    
}