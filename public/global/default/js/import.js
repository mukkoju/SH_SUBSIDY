$(document).ready(function() {
  if (window.location.href.indexOf("?ref=import") >= 0) {
    var nodes = [], inlnNds = ["A", "B", "STRONG", "I", "#text", "SPAN", "SUP"], splNds1 = ['A', "IFRAME", "OL", "UL", "B", "STRONG", "I"], x = 0; // 
    getContents($("#imprt-dt"), document.getElementById("imprt-dt"));
    // console.log(nodes);
    if ($("#txt1").text().trim() == "")
      $("#txt1").remove();
    else
      $("#txt1").removeClass("emty");

    function getContents(elem, elm) {
      var lstTg = $(".stry").find(".e-b:last");
      var prvElm = lstTg.contents().last();
      prvElm = prvElm.length ? prvElm[0]["nodeName"] : 0;
      var node = elem[0]["nodeName"];
      var imgInA = (node == "A" ? elem.find("img").length : 0);
      if (imgInA)
        elem.contents().filter(function() {
          getContents($(this));
        });
      else if (prvElm == "BR" && node == "BR")
        return;
      else if ((inlnNds.indexOf(prvElm) >= 0 && inlnNds.indexOf(node) >= 0 && elm.previousSibling != null) && (node != "IMG" && !lstTg.hasClass("i-b"))) {
        if (node == "SPAN" || elem.find("span").length) {
          var dt = (elem[0]['outerHTML'] ? elem[0]['outerHTML'] : elem[0]['innerHTML']);
          dt = dt.replace(/(<span\b[^>]*>|<\/span>)/g, "");
          elem = $.parseHTML(dt);
        }
        lstTg.append(elem);
        lstTg.data("edDt", {
          "id": lstTg.attr("id"),
          "data": lstTg.trimText(lstTg.html())
        });
      }
      else if (elem.contents().length == 0 || splNds1.indexOf(node) >= 0) {
        var d = new Date();
        var tmsp = d.getTime();
        tmsp = tmsp + x++;
        importData(elem, tmsp);
        nodes.push(elem);
      }
      else
        elem.contents().filter(function() {
          getContents($(this), this);
        });

    }

    function importData(elem, tmsp) {
      var node = elem[0]["nodeName"];
      var dt, str;
      var lstTg = $(".stry").find(".e-b:last");
      if (lstTg.html() == "")
          lstTg.remove();
        
      if (node == "#text" && elem.text().trim() != "" || node == "BR") {
        str = '<div id = "txt' + tmsp + '" tabindex="0" contenteditable="true" class="e-b ed-b t-b">' + (elem.text() ? elem.text() : '') + '</div>';
        dt = {
          "id": "txt" + tmsp,
          "data": elem.trimText(elem.text())
        };
        $("#stry").append(str);
        $("#txt" + tmsp).data("edDt", dt);
      }
      else if (node == "IMG") {
        dt = [{
            "id": "ib-" + tmsp,
            "data": [{
                "src": elem[0]["src"],
                "cp": {"id": "", "cn": ""}
              }]
          }];
        $("#stry").loadArt(dt, 1);
      }
      else if (splNds1.indexOf(node) >= 0) {
        str = '<div id = "txt' + tmsp + '" tabindex="0" contenteditable="true" class="e-b ed-b t-b"></div>';
        $("#stry").append(str);
        if (node == "SPAN" || elem.find("span").length) {
          var temp = (elem[0]['outerHTML'] ? elem[0]['outerHTML'] : elem[0]['innerHTML']);
          temp = temp.replace(/(<span\b[^>]*>|<\/span>)/g, "");
          elem = $.parseHTML(temp);
        }
        $("#txt" + tmsp).html(elem);
        dt = {
          "id": "txt" + tmsp,
          "data": $().trimText($("#txt" + tmsp).html())
        };
        $("#txt" + tmsp).data("edDt", dt);
      }
    }
  }
});

  