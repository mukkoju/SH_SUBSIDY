<?php

class Index extends Controller {

    function __construct() {
        parent::__construct();
    }

    public function index() {
        $this->view->render('index/index');
    }

    public function newPldge() {
        $this->isXMLRequest();
        require APP_PATH . '/models/index.php';
        echo ((new Index_Model())->recordPledge($_POST));
    }

    public function requestLeader() {
        $this->isXMLRequest();
        require APP_PATH . '/models/index.php';
        echo ((new Index_Model())->requestSubsidy($_POST));
    }
    
    public function getConstituency(){
        $this->isXMLRequest();
        require APP_PATH . '/models/index.php';
        echo ((new Index_Model())->getConstituencies($_POST));
    }
    
    public function getCandidate(){
        $this->isXMLRequest();
        require APP_PATH . '/models/index.php';
        echo ((new Index_Model())->getCandidateDetails($_POST));
    }
    
    public function getStats(){
        $this->isXMLRequest();
        require APP_PATH . '/models/index.php';
        echo ((new Index_Model())->getAllStats($_POST));
    }

    public function isXMLRequest($checkSession = null) {
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && (strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')) {
            if ($checkSession) {
                if (isset($_SESSION['sn_F_Nme'])) {
                    return;
                } else {
                    echo '{"success":-10,"msg":"You need to login to proceed further!"}';
                    exit();
                }
            }
            return;
        } else {
            header('HTTP/1.0 404 Not Found');
            exit();
        }
    }

}
