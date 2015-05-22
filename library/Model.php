<?php

class Model {

    public function getDBConnection($type, $db) {
        return (new PDO('mysql:host=' . $host . ';dbname=' . $db, 'saddahaq', 'dambo'));
    }

}
