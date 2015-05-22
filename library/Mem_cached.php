<?php

class Mem_cached{
    
    function __construct(){
        $this -> cache = new Memcached();
        $this -> cache -> addServer(CACHE_SERVERS, CACHE_PORT); 
        return $this -> cache;
    }
}
