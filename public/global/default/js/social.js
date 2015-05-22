//For Google +1
var element = document.createElement("script");
element.src = "https://apis.google.com/js/plusone.js";
document.body.appendChild(element);
gapi.plus.go();

//For Twitter
var element = document.createElement("script");
element.src = "//platform.twitter.com/widgets.js";
document.body.appendChild(element);

//For Facebook
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));