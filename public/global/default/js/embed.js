
/* Resize Iframe Functionality*/
function stShIfmSze(elm) {
    elm.removeAttribute("height");
    if (elm.getAttribute("id") != null && elm.getAttribute("id").length > 5) {
        if (elm.getAttribute("id").substr(0, 6) == "sh-ifm" && elm["nodeName"] == "IFRAME") {
            var receiver = elm.contentWindow;
            receiver.postMessage({"msg": 'getIframeSize', "id": elm.getAttribute("id")}, elm.src.substr(0, elm.src.indexOf("/embed?")));
        }
    }
}

/* Handles response to the postMessage function */
hndlPstMsgRspns = function (e) {
    if (e.data.msg == "setIframeSize" && e.data.id.substr(0, 6) == "sh-ifm") {
        document.getElementById(e.data.id).setAttribute("height", e.data.ht);
    }
};
window.addEventListener('message', hndlPstMsgRspns, false);

/* Code that replaces anchor with iframe */
var elms = document.querySelectorAll(".sh-anch-ifm");
var forEach = Array.prototype.forEach;
var maxTime = 0;

if (elms.length == 0)
    srchFrAnchr();
else
    rplcAnchr();

function srchFrAnchr() {
    maxTime++;
    if (maxTime == 6) {
        alert("Something went wrong please try again.");
        return;
    }
    setTimeout(function () {
        elms = document.querySelectorAll(".sh-anch-ifm");
        if (elms.length == 0)
            srchFrAnchr();
        else
            rplcAnchr();
    }, 500);
}

function rplcAnchr() {
    forEach.call(elms, function (elm) {
        if (elm.getAttribute("id") != null && elm.getAttribute("id").length > 5) {
            if (elm.getAttribute("id").substr(0, 5) == "anch-" && elm["nodeName"] == "A") {
                var ifm = document.createElement("IFRAME");
                ifm.setAttribute("src", elm.getAttribute("href"));
                ifm.setAttribute("style", "border:1px solid rgba(0,0,0,.1); max-width : 900px;");
                ifm.setAttribute("id", "sh-ifm-" + elm.getAttribute("id").substr(5, elm.getAttribute("id").length));
                ifm.setAttribute("class", "sh-ifm");
                ifm.setAttribute("onLoad", "stShIfmSze(this)");
                ifm.setAttribute("name", "embd-eb");
                ifm.setAttribute("width", "99%");
                elm.parentNode.replaceChild(ifm, elm);
            }
        }

    });
}
