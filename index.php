<?php
//Setting default time zone
date_default_timezone_set('Asia/Calcutta');

defined('APP_PATH') || define('APP_PATH', dirname(__FILE__).'/application');
defined('APP_PUBLIC') || define('APP_PUBLIC', dirname(__FILE__).'/public');


//Session stuff
if (!isset($_SESSION)){
//  ini_set('session.cookie_domain', (ISLIVE || $_SERVER['SERVER_NAME'] == 'testing.saddahaq.com') ? '.saddahaq.com' : '');
//  ini_set('session.save_handler', 'memcached');
//  ini_set('session.save_path', CACHE_SERVERS.':'.CACHE_PORT);
  ini_set('session.cookie_lifetime', 60 * 60 * 24 * 7);
  ini_set('session.gc_maxlifetime', 60 * 60 * 24 * 7);
//  session_name('hqtme');
  session_start();
}

require 'library/Bootstrap.php';
require 'library/Mem_cached.php';
require 'library/Controller.php';
require 'library/View.php';
require 'library/Model.php';

$application = new Bootstrap();