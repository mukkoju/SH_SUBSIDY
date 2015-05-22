<html>
    <head></head>
    <body>
        <div class="container-fluid">
            <header class="main-header">
                <div class="container">
                    <div class="row">
                        <div class="span5 header-logo">
                            <!--<a href="index.html"><img src="https://testing.saddahaq.com/public/Uploads/dontha/65794342-gas-subsidy.png"></a>-->
                        </div>

                        <div class="span10">
                            <nav class="navbar">
                                <div class="pull-right" id="subsdy-mnu">
                                    <!--mobile menu-->
                                    <div class="navbar-header hidden-desktop hidden-phone">
                                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                            <span class="sr-only">Toggle navigation</span>
                                            <span class="icon-bar"></span>
                                            <span class="icon-bar"></span>
                                            <span class="icon-bar"></span>
                                        </button>
                                    </div>

                                    <!--Desktop menu-->
                                    <div class="hidden-phone">
                                        <ul class="nav navbar-nav">
                                            <li>
                                                <a href="#home">HOME</a>
                                            </li>
                                            <li>
                                                <a href="#lpgdata">LPG DATA</a>
                                            </li>
                                            <li>
                                                <a href="#stroies">STORIES</a>
                                            </li>
                                            <li>
                                                <a href="#services">STATISTICS</a>
                                            </li><li>
                                                <a href="#"></a>
                                            </li>
                                            <li>
                                                <a href="#login" class="subsidy-btn">LOGIN</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <div id="intro" class="intro-block" style="height: 660px">
                <section>
                    <div class="slogan">WHY IT MATTERS?</div>
                    <div class="secondary-slogan">LPG is a subsidized commodity in India and the subsidy amount was a whopping Rs. 40,000 crores during 2013-14. The same money could be used for development purpose. We call upon all LPG consumers who can afford to pay the market price for their LPG supply to be a part of this nation building exercise by giving up LPG subsidy.</div>
                    <a id="scrl-dwn" href="#steps"><i class="icon-chevron-down"></i></a>
                </section>
            </div>
        </div>
        <div class="container-fluid">
            <div id="steps">
                <div class="flw-stps">
                    <div class="hedng">step1:<b>pledge</b></div>
                    <div class="dsc">LPG is a subsidized commodity in India and the subsidy amount was a whopping Rs. 40,000 crores during 2013-14. The same money could be used for development purpose. We call upon all LPG consumers who can afford to pay the market price for their LPG supply to be a part of this nation building exercise by giving up LPG subsidy.</div>
                    <a class="subsidy-btn large">YES, I GIVE UP</a>
                </div>
                <div class="flw-stps">
                    <div class="hedng">step1:<b>ASK YOUR MLA/MP</b></div>
                    <div class="dsc">LPG is a subsidized commodity in India and the subsidy amount was a whopping Rs. 40,000 crores during 2013-14. The same money could be used for development purpose. We call upon all LPG consumers who can afford to pay the market price for their LPG supply to be a part of this nation building exercise by giving up LPG subsidy.</div>
                    <a class="subsidy-btn large">SEND A MAIL</a>
                </div>
                <div class="flw-stps">
                    <div class="hedng">step1:<b>SHARE YOUR STORY</b></div>
                    <textarea></textarea>
                    <a class="subsidy-btn large" style="float: left;">SHARE IT</a>
                    <div class="socl"><i class="icon-facebook" style="color: white !important"></i></div>
                    <div class="socl"><i class="icon-twitter" style="color: white !important"></i></div>
                    <div class="socl"><i class="icon-google" style="color: white !important"></i></div>
                
                </div>
            </div>
            <div id="stream">
                <div class="strm-sec">
                    <div class="ttl">Stream</div>
                    <div class="sec">
                        <div class="stat">99999+</div>
                        <div class="stat">99999+</div>
                        <div class="stat">99999+</div>
                    </div>
                    <div class="view-all"><a href="#">view all stats</a></div>
                </div>
                
                <div class="strm-sec">
                    <div class="ttl">Stream</div>
                    <div class="sec">
                        <div class="stat">&nbsp</div>
                    </div>
                    <div class="sec">
                        <div class="stat">&nbsp</div>
                    </div>
                    <div class="sec">
                        <div class="stat">&nbsp</div>
                    </div>
                    <div class="view-all"><a href="#">See all stories</a></div>
                </div>
            </div>
            <div class="clearfix"></div>
            <div id="prtnr-sec">
                <h2>OUR PROUD PARTNERS</h2>
                <div class="foter">
                    <p>READY TO PARTNER WITH US?</p>
                    <a class="subsidy-btn invers" href="#">CONTACT US</a>
                </div>
            </div>
            <footer>
                <div class="socl"><i class="icon-facebook" style="color: white !important"></i></div>
                <div class="socl"><i class="icon-twitter" style="color: white !important"></i></div>
                <div class="socl"><i class="icon-google" style="color: white !important"></i></div>
            </footer>
        </div>
        <script>
        jQuery(document).ready(function($){

		  	$(window).scroll(function() {
		  		
		  		console.log("asdf");

				if ($(window).scrollTop() > 100 ){
		    
		 		$('.main-header').addClass('shows');
		    
		  		} else {
		    
		   	 	$('.main-header').removeClass('shows');
		    
		 		};   	
			});
                        
                        $('body').on('click', '#scrl-dwn', function(e){		
				e.preventDefault()
                            jQuery('html, body').animate({
                                scrollTop : jQuery(this.hash).offset().top
                              }, 1000);
                          });
		  });
        </script> 
    </body>
</html>