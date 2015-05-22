$(document).ready(function () {
$.fn.drawChart = function (data, chart, w, h, chartId, title) {
    if (data[0] == undefined)
        chooseChart(data, 1, chart, w, h, chartId, title);
    else {
        var i, j;
        var new_d = {}, tmp;
        for (i = 0; i < data.length; i++) {
            tmp = {};
            tmp.A = data[i]['x'][0];
            for (j = 0; j < data[i]['y'].length; j++) {
                tmp[String.fromCharCode(j + 66)] = data[i]['y'][j];
            }
            new_d[i + 1] = tmp;
        }
        chooseChart(new_d, 1, chart, w, h, chartId, title);
    }
};
$.fn.extend({
    addChartBlock: function () {
        var d = new Date();
        var chtCnt = d.getTime();
        var crtStr = '<div tabindex="0" class="e-b cht-b m-b media slctd" id="cht' + chtCnt + '" data-ed-dt=\'{"id":"cht' + chtCnt + '"}\'>' +
          '<ul class="eb-opts">' +
          '<li><i class="icon-drag handle" title="Move"></i> </li>' +
          '<li><a href="#con-del" role="btn" data-toggle="modal"><i class="icon-trash-closed del-eb" title="Delete Chart"></i></a></li>' +
          '</ul>' +
          '<div class="cht-hldr">' +
          '<h2 class="m-b-hdng emty" contenteditable="true" data-emty="Add a title for this chart here"></h2>' +
          '<section>' +
          '<h3>Choose chart type:</h3>' +
          '<a href="#" class="cht-tp box" data-tp="b"><i class="icon-column-chart"></i><span class="block">COLUMN</span></a>' +
          '<a href="#" class="cht-tp box" data-tp="gb"><i class="icon-column-chart"></i><span class="block">GROUPED COLUMN</span></a>' +
          '<a href="#" class="cht-tp box" data-tp="l"><i class="icon-line-chart"></i><span class="block">LINE</span></a>' +
          '<a href="#" class="cht-tp box" data-tp="gl"><i class="icon-grp-line-chart"></i><span class="block">GROUPED LINE</span></a>' +
          '<a href="#" class="cht-tp box" data-tp="p"><i class="icon-pie-chart"></i><span class="block">PIE</span></a>' +
          '<div class="clearfix"></div>' +
          '</section>' +
          '<div class="chart hideElement">' +
          '<ul class="cht-opts"></ul><svg class="svg"></svg><ul class="chart-tags"></ul>' +
          '<div class="overlay hideElement"><div class="cht-edt">' +
          '<form class="cht-form no-hgt transition" enctype="multipart/form-data" method="post" action="/ajax/prsxl">' +
          '<div>' +
          '<div class="box">' +
          '<p>Upload File</p>' +
          '<p>' +
          '<i class="icon-xlsx"></i>' +
          '<span class="block">(.xls,.xlsx files allowed)</span>' +
          '</p>' +
          '<input type="file" name="cht-fl" class="cht-fl" accept=".xlsx,.xls"></input>' +
          '<progress max="100" value="0" class="red img-prgs"></progress>' +
          '</div>' +
          '<div class="box" id = "cht-smple">' +
          '<p>For Sample Copy</p>' +
          '<p><a href="#" class="block"><i class="icon-xlsx"></i><span class="block">Click here to download</span></a></p>' +
          '</div>' +
          '</div>' +
          '</form>' +
          '</div></div>' +
          '</div>' +
          '</div></div>';
        var container = $('.crnt > .stry'), actvBlk = $('#tlbr-popup').data('indx');
        if (actvBlk['lst'])
            container = container.find('#' + actvBlk['lst'] + ' .item.active');
        container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').after(crtStr);
        if (actvBlk['tgd'])
            container.find(' > .e-b:eq(' + actvBlk['indx'] + ')').remove();
    },
    parseChtExcel: function(elem, data){
        if (data != undefined)
        {
            data = JSON.parse(data);
            var updtJson = elem.parents('.cht-b').data('edDt');
            updtJson = (updtJson !== undefined) ? updtJson : {};
            updtJson.data = data;
            elem.parents('.cht-b').data('edDt', updtJson);
            elem.parents(".chart").siblings('section').addClass('hideElement');
            try {
                elem.closest('section').siblings('.chart').removeClass('hideElement')
                  .drawChart(data, updtJson.tp, elem.parents('.e-b').last().width() - 56, 350, updtJson.id, 1);
                elem.parents(".overlay").remove();
            }
            catch (e) {
               var dt = {
                    "1": {"A": "Score", "B": "2009", "C": "2011"}, "2": {"A": "Rahul", "B": "550", "C": "650"},
                    "3": {"A": "George", "B": "1000", "C": "100"}, "4": {"A": "Mustaq", "B": "300", "C": "900"},
                    "5": {"A": "Rajesh", "B": "400", "C": "400"}, "6": {"A": "Kiran", "B": "245", "C": "2415"},
                    "7": {"A": "Sachin", "B": "654", "C": "604"}
                }; 
                 elem.closest('section').siblings('.chart').removeClass('hideElement')
                  .drawChart(dt, updtJson.tp, elem.parents('.e-b').last().width() - 56, 350, updtJson.id, 1);
                elem.closest('section').find("progress").addClass('hideElement');
                $('#sts-msg').showStatus("Excel data format is not similar to the sample copy.", "err");
            }
        }
    }
});
/* Highlighting selected chart type based on the button clicked */
$('.stry').on('click', '.cht-hldr .cht-tp', function (e) {
    e.preventDefault();
    var $this = $(this);
    var par = $this.closest(".e-b");
    var json = $this.closest('.cht-b').data('edDt');
    json = (json !== undefined) ? json : {};
    if ($this.hasClass('selected'))
    {
        $this.removeClass('selected');
        par.find('.cht-form').addClass('no-hgt').removeClass('in');
        json.tp = "";
    }
    else
    {
        $this.siblings('.cht-tp').removeClass('selected');
        $this.addClass('selected');
        par.find('.cht-form').removeClass('no-hgt').addClass('in');
        json.tp = $this.data('tp');
    }
    $this.parents('.cht-b').data('edDt', json);
    var dt = {
            "1": {"A": "Score", "B": "2009", "C": "2011"}, "2": {"A": "Rahul", "B": "550", "C": "650"},
            "3": {"A": "George", "B": "1000", "C": "100"}, "4": {"A": "Mustaq", "B": "300", "C": "900"},
            "5": {"A": "Rajesh", "B": "400", "C": "400"}, "6": {"A": "Kiran", "B": "245", "C": "2415"},
            "7": {"A": "Sachin", "B": "654", "C": "604"}
        };
    if(json.data)
      dt = json.data;
    try {
        par.find('.chart').removeClass('hideElement')
          .drawChart(dt, json.tp, par.width() - 56, 350, par.attr("id"), 1);
        $('#usr-bar').find('#art-drft').data('chngd', 1);
    }
    catch (e) {
        par.find('section').removeClass('hideElement').find('.chart').addClass('hideElement');
        par.find('section').find("progress").addClass('hideElement');
        $('#sts-msg').showStatus("Excel data format is not similar to the sample copy.", "err");
    }
    $(".stry").data("d3Loaded", "1");

    par.find(".overlay").removeClass("hideElement");
});

/* Charts functionality */
var chartclrs = ["#cd7058", "#79c36a", "#ffd200", "#327aba", "#f9a65a", "#cd7058", "#286b7b", "#ff6868", "#60284f", "#56b0ff", "#00a597", "#cd7058", "#286b7b", "#ff6868", "#60284f", "#56b0ff", "#00a597", "#cd7058", "#79c36a", "#ffd200", "#327aba", "#f9a65a", "#cd7058", "#286b7b", "#ff6868", "#60284f", "#56b0ff", "#00a597"];

function barchart(d, colnum, w, h, chartId, clr)
{
    var barPadding, leftmargin = 50, numOfBarsVisible = 32;
    var barwidth = 0;
    var svgtext, svgbar, end, start, clms, neg_ht = 0;
    var move = 0, r = 1, i;
    var tmp, data = [];
    var maxval = {}, max_neg = {};
    var clms = Object.keys(d['1']).map(function (k) {
        return d['1'][k];
    });
    for (i = clms.length - 1; i >= 0; i--) {
        if (clms[i] == null || clms[i] == "")
            clms.pop();
        else
            break;
    }
    if (clms.length > 2)
        showColumnButtons(clms.slice(1, clms.length), 'b', w, h, chartId, clr);
    $.each(d, function (r, row) {
        if (row['A'] != null) {
            tmp = [];
            $.each(row, function (c, cell) {
                if (d['1'][c] != null && d['1'][c] != "" && d['1'][c] != undefined) {
                    if (c == 'A' || r == '1') {
                        cell = cell + ""; //making all xaxis values and headings as string.
                        tmp.push(cell);
                    }
                    else {
                        cell = parseFloat(cell);
                        if (cell != null && !isNaN(cell) && cell != "" && cell != undefined)
                            tmp.push(cell);
                        else {
                            if (d["1"][c] != null) {
                                cell = 0;
                                tmp.push(cell);
                            }
                        }
                        if (isNaN(cell))
                            throw "'" + cell + "' not a number. All the values should be numbers only.";
                        if (maxval[c] == undefined) {
                            max_neg[c] = cell;
                            maxval[c] = cell;
                        }
                        else if (maxval[c] != undefined && maxval[c] < cell)
                            maxval[c] = cell;
                        else if (max_neg[c] != undefined && cell < max_neg[c])
                            max_neg[c] = cell;
                    }
                }
            });
            data.push(tmp);
        }
    });
    maxval = Object.keys(maxval).map(function (k) {
        if (max_neg[k] < 0) {
            if (maxval[k] < 0)
                return -maxval[k] - max_neg[k];
            return maxval[k] - max_neg[k];
        }
        return maxval[k];
    });
    max_neg = Object.keys(max_neg).map(function (k) {
        return max_neg[k];
    });
    maxval.unshift(0);
    max_neg.unshift(0);
    if (data[0].length == 2) {
        leftmargin += 30;
        w = w - 30;
    }
    if (data.length <= 9)
        numOfBarsVisible = 8;
    else if (data.length <= 33)
        numOfBarsVisible = data.length - 1;
    barPadding = (32 / numOfBarsVisible) * 4;
    w = w - 16; //because of 8px for .chart div (left 8px + right 8px)    
    var barchartData = data.slice(1, data.length);
    //id created for chart and chart tags divisions
    var trgt = $('#' + chartId).find(".chart");
    $("#" + chartId).find(".chart-tags").attr('id', "barchart-tags");
    //Previous heading removed and new heading added(purpose: when there are radio buttons)
    $("#" + chartId).find("#chart-head").remove();
    $("#" + chartId).find("#legend").remove();
    $("#" + chartId).find("#yaxis").remove();
    $("#" + chartId).find(".arrows").remove();
    var temp;
    //SVG element is created below    
    var svg = d3.select('#' + chartId)
      .select(".svg");
    svg = svg.attr("height", h)
      .attr("width", w + leftmargin)
      .selectAll("g")
      .data(barchartData)
      .enter()
      .append("g")
      .attr("id", function (d) {
          temp = d[0] + '';
          temp = temp.replace(/[^a-zA-Z0-9]/g, "");
          return temp;
      });
    //inside the svg element we add all rectangles(bars) 
    svgbar = svg.append("rect")
      .attr("class", "r")
      .attr("y", function (d) {
          return h;
      })
      .attr("x", function (d, i) {
          return i * ((w + barPadding) / numOfBarsVisible) + leftmargin;
      })
      .attr("width", function () {
          if (barwidth == 0)
              barwidth = w / numOfBarsVisible - barPadding;
          return w / numOfBarsVisible - barPadding;
      })
      .attr("height", function (d) {
          return 0;
      })
      .attr("fill", function (d, i) {
          if (clr == 1)
              return chartclrs[(i + 1) % chartclrs.length];
          else
              return "#33ADFF";
      });
    svgtext = svg.append("text")
      .attr("class", "label")
      .text(function (d) {
          if (d[1] == 0)
              return d[1];
      })
      .attr("y", function () {
          return h - neg_ht;
      })
      .attr("x", function (d, i) {
          return i * ((w + barPadding) / numOfBarsVisible) + leftmargin + (barwidth / 2) + 6;//6 because fontsize/2 = 6
      })
      .attr("text-anchor", "end");

    trgt.find(".chart-tags").before("<svg class='svg2'></svg>");
    var svg2 = d3.select('#' + chartId)
      .select(".svg2");
    var svg2height = 0;
    for (var k = 0; k < barchartData.length; k++)
    {
        if (barchartData[k][0].length >= 10) {
            svg2height = 108; //12 * 9
        }
        else if (svg2height < barchartData[k][0].length * 9)
        {
            svg2height = barchartData[k][0].length * 9;
        }
    }
    svg2 = svg2.attr("height", svg2height)
      .attr("width", w + leftmargin)
      .selectAll("g")
      .data(barchartData)
      .enter()
      .append("g")
      .attr("val", function (d) {
          return d[0];
      });
    //xaxis-label is added when there is no xaxis 
    var xAxislabel;
    xAxislabel = svg2.append("text")
      .attr("class", "bottom-label")
      .text(function (d) {
          if (d[0].length >= 12) {
              return d[0].substring(0, 10) + "..";
          }
          return d[0];
      })
      .attr("y", function (d, i) {
          return i * ((w + barPadding) / numOfBarsVisible) + leftmargin + (barwidth / 2) + 6;//6 because fontsize/2 = 6
      })
      .attr("x", function (d) {
          return 0;
      })
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)");
    updateBar(1);
    trgt.find(".col-name").on("change", function ()
    {
        updateBar($(this).val());
    });
    trgt.on("click", ".move-left", function () {
        update(37);
    });
    trgt.on("click", ".move-right", function () {
        update(39);
    });

    function updateBar(clnm) {
        colnum = clnm;
        if (clr == "dshb") {
            if (maxval[clnm] < 5) {
                maxval[clnm] = 5;
            }
        }
        if (max_neg[clnm] < 0)
            neg_ht = (-max_neg[clnm] / maxval[clnm]) * h;
        else
            neg_ht = 0;
        r = maxval[clnm] / h;
        r = r * 1.15; //this is for some top padding   

        svgbar.transition()
          .duration(400)
          .ease('bounce')
          .attr('y', function (d) {
              if (d[clnm] < 0)
                  return (h - neg_ht);
              return (h - neg_ht) - (d[clnm] / r);
          })
          .attr('height', function (d) {
              if (d[clnm] < 0)
                  return -(d[clnm] / r);
              return d[clnm] / r;

          });
        trgt.find(".yaxis").remove();
        buildYaxis(max_neg[clnm], maxval[clnm], (h - neg_ht), chartId, h, w, leftmargin, numOfBarsVisible, (barwidth / 2), 'b', barPadding);
        trgt.find(".tick").find("text").each(function () {
            var v = $(this).text();
            $(this).text(formatTicsText(v));
        });
        if (data[0].length == 2)
        {
            d3.select('#' + chartId)
              .select(".chart")
              .select(".yaxis")
              .append("text")
              .text(data[0][1])
              .attr("x", -(h - h / 2) - 10)
              .attr("y", 15)
              .attr("id", "yaxis-title")
              .attr("text-anchor", "middle")
              .attr("transform", "rotate(-90)");
            trgt.find(".yaxis #pos-axis, .yaxis #neg-axis").attr("transform", "translate(20,0)");
        }
        //adds effect to the loading data
        svgbar.transition()
          .duration(400)
          .ease('bounce')
          .attr("y", function (d, i) {
              if (d[clnm] < 0)
                  return (h - neg_ht);
              if ((i < move) || (i > numOfBarsVisible + move - 1))
                  return (h - neg_ht);
              return (h - neg_ht) - (d[clnm] / r);

          })
          .attr("height", function (d, i) {
              if ((i < move) || (i > numOfBarsVisible + move - 1))
              {
                  return 0;
              }
              if (d[clnm] < 0)
                  return -(d[clnm] / r);
              return d[clnm] / r;
          })
          .attr("v", function (d) {
              return d[clnm];
          });
        svgtext.transition()
          .duration(400)
          .ease('bounce')
          .text(function (d) {
              if (d[clnm] == 0)
                  return d[clnm];
          })
          .attr("y", function () {
              return h - neg_ht;
          });
    }
    if (barchartData.length > numOfBarsVisible)
    {
        start = 0;
        end = 0;
        var arrows = '<div class = "arrows"><a class="move-left" href="#"><i class="icon-chevron-left-sign"></i></a><a class="move-right" href="#"><i class="icon-chevron-right-sign"></i></a></div>';
        if (trgt.find(".arrows").length == 0)
        {
            trgt.find(".cht-opts").after(arrows);
        }
        //based on the key entered start, end, move values are updated
        function update(arrowKey) {
            var clnm = colnum;
            r = maxval[clnm] / h;
            r = r * 1.15; //this is for some top padding     

            if (arrowKey == 37) //if arrow key is pressed
            {
                end = 0;

                move = move - 1;
                if (move < 0)
                {
                    move = 0;
                    start = 0;
                }
            }
            if (arrowKey == 39)//if right arrow key is pressed
            {
                start++;
                if (move == barchartData.length - numOfBarsVisible + 1)
                {
                    end++;
                }
                else {
                    move = move + 1;
                }
            }
            //With the help of start, end, move values bars & its labels are updated
            if (!((move + numOfBarsVisible == barchartData.length && end >= 1) || (move == 0 && start == 0)))
            {
                svgbar.transition()            //adds effect to the loading data 
                  .duration(1000)
                  .attr("y", function (d, i) {
                      if (d[clnm] < 0)
                          return (h - neg_ht);
                      if ((i > (move + numOfBarsVisible - 2) || i < move) && arrowKey == 39)
                          return (h - neg_ht);
                      else if ((i > (move + numOfBarsVisible - 1) || i <= move) && arrowKey == 37)
                          return (h - neg_ht);
                      return (h - neg_ht) - (d[clnm] / r);
                  })
                  .attr("height", function (d, i) {
                      if ((i > (move + numOfBarsVisible - 2) || i < move) && arrowKey == 39)
                          return 0;
                      else if ((i > (move + numOfBarsVisible - 1) || i <= move) && arrowKey == 37)
                          return 0;
                      if (d[clnm] < 0)
                          return -(d[clnm] / r);
                      return d[clnm] / r;
                  })
                  .attr("x", function (d, i) {
                      return (i - move) * ((w + barPadding) / numOfBarsVisible) + leftmargin;
                  })
                  .attr("y", function (d, i) {
                      if (d[clnm] < 0)
                          return (h - neg_ht);
                      if (i >= move && i < (move + numOfBarsVisible))
                          return (h - neg_ht) - (d[clnm] / r);
                      return (h - neg_ht);
                  })
                  .attr("height", function (d, i) {
                      if (i >= move && i < (move + numOfBarsVisible))
                      {
                          if (d[clnm] < 0)
                              return -(d[clnm] / r);
                          return  d[clnm] / r;
                      }
                      return 0;
                  });
                svgtext.transition()            //adds effect to the loading data 
                  .duration(1000)
                  .attr("y", function () {
                      return h - neg_ht;
                  })
                  .attr("x", function (d, i) {
                      return (i - move) * ((w + barPadding) / numOfBarsVisible) + leftmargin + (barwidth / 2) + 6;//6 because fontsize/2 = 6
                  })
                  .attr("text-anchor", "end");
                xAxislabel.transition()            //adds effect to the loading data 
                  .duration(1000)
                  .attr("y", function (d, i) {
                      return (i - move) * ((w + barPadding) / numOfBarsVisible) + leftmargin + (barwidth / 2) + 6;
                      ;
                  })
                  .text(function (d, i) {
                      if ((i > (move + numOfBarsVisible - 1) || i < move) && arrowKey == 39)
                      {
                          return "";
                      }
                      else if ((i > (move + numOfBarsVisible) || i < move) && arrowKey == 37)
                      {
                          return "";
                      }
                      else if (d[0].length >= 10) {
                          return d[0].substring(0, 8) + "..";
                      }
                      return d[0];
                  });
            }
        }
    }
    //on hover effects
    trgt.find('.svg g').on("mouseenter", function (e)
    {
        if (parseFloat($(this).find(".r").attr('v')) > 0)
            var txtbHt = parseInt($(this).find(".r").attr('height')) + neg_ht + svg2height;
        else
            txtbHt = neg_ht + svg2height;
        barChartMouseEnter($(this).find(".r").attr('v'), $(this).find(".r").attr('x'), txtbHt, e, $(this).attr('id'), chartId, $(this).find(".r").attr('width'));
    });
    trgt.find('.svg g').on("mouseleave", function ()
    {
        barChartMouseLeave($(this).attr('id'), chartId);
    });
    trgt.find('.svg2 g').on("mouseenter", function (e)
    {
        xaxisMouseEnter($(this).attr('val'), e, chartId);
    });
    trgt.find('.svg2 g').on("mouseleave", function ()
    {
        xaxisMouseLeave(chartId);
    });
}
function linechart(d, colnum, w, h, chartId, title)
{
    var leftmargin = 50, numOflinesVisible = 16;
    var svgline, svgcircle, xAxislabel;
    var end, start, clms, neg_ht = 0;
    var move = 0, r = 1, i;
    var tmp, data = [];
    var maxval = {}, max_neg = {};
    var clms = Object.keys(d['1']).map(function (k) {
        return d['1'][k];
    });
    for (i = clms.length - 1; i >= 0; i--) {
        if (clms[i] == null || clms[i] == "")
            clms.pop();
        else
            break;
    }
    showColumnButtons(clms.slice(1, clms.length), 'l', w, h, chartId, title);
    //json data is converted to array which can be binded to svg elements
    $.each(d, function (r, row) {
        if (row['A'] != null) {
            tmp = [];
            $.each(row, function (c, cell) {
                if (d['1'][c] != null && d['1'][c] != "" && d['1'][c] != undefined) {
                    if (c == 'A' || r == '1') {
                        cell = cell + ""; //making all xaxis values and headings as string.
                        tmp.push(cell);
                    }
                    else {
                        cell = parseFloat(cell);
                        if (cell != null && !isNaN(cell) && cell != "" && cell != undefined)
                            tmp.push(cell);
                        else {
                            if (d["1"][c] != null) {
                                cell = 0;
                                tmp.push(cell);
                            }
                        }
                        if (isNaN(cell))
                            throw "'" + cell + "' not a number. All the values should be numbers only.";
                        if (maxval[c] == undefined) {
                            max_neg[c] = cell;
                            maxval[c] = cell;
                        }
                        else if (maxval[c] != undefined && maxval[c] < cell)
                            maxval[c] = cell;
                        else if (max_neg[c] != undefined && cell < max_neg[c])
                            max_neg[c] = cell;
                    }
                }
            });
            data.push(tmp);
        }
    });
    maxval = Object.keys(maxval).map(function (k) {
        if (max_neg[k] < 0) {
            if (maxval[k] < 0)
                return -maxval[k] - max_neg[k];
            return maxval[k] - max_neg[k];
        }
        return maxval[k];
    });
    max_neg = Object.keys(max_neg).map(function (k) {
        return max_neg[k];
    });
    maxval.unshift(0);
    max_neg.unshift(0);
    if (data[0].length == 2) {
        leftmargin += 30;
        w = w - 30;
    }
    var linechartData = data.slice(1, data.length);

    if (data[0].length == 2) {
        leftmargin += 30;
        w = w - 30;
    }
    if (data.length <= 9) // -1 because 1st value is header-row.
        numOflinesVisible = 8;
    else if (data.length <= 17)
        numOflinesVisible = data.length - 1;

//    r = maxval[1] / h;
//    r = r * 1.15; //this is for some top padding   
    //id created for chart and chart tags divisions
    var trgt = $('#' + chartId).find(".chart");
    $("#" + chartId).find(".chart-tags").attr('id', "linechart-tags");
    //Previous heading removed and new heading added(purpose: when there are radio buttons)
    $("#" + chartId).find("#chart-head").remove();
    $("#" + chartId).find("#legend").remove();
    $("#" + chartId).find("#yaxis").remove();
    $("#" + chartId).find(".arrows").remove();
    //SVG element is created below
    var svg = d3.select('#' + chartId)
      .select(".svg");
    svg = svg.attr("height", h)
      .attr("width", w + leftmargin)
      .selectAll("g")
      .data(linechartData)
      .enter()
      .append("g")
      .attr("id", function (d) {
          return d[0];
      });
    //line from one point(value) to other point
    svgline = svg.append("line")
      .attr("x1", function (d, i) {
          return i * (w / numOflinesVisible) + leftmargin;
      })
      .attr("x2", function (d, i) {
          if (i == linechartData.length - 1)
          {
              return i * (w / numOflinesVisible) + leftmargin;
          }
          return (i + 1) * (w / numOflinesVisible) + leftmargin;
      })
      .attr("y1", function (d) {
          if (d[1] < 0) {
              return h;
          }
          return h - (d[1] / r);
      })
      .attr("y2", function (d, i) {
          if (i == linechartData.length - 1)
          {
              return h - (d[1] / r);
          }
          d = linechartData[i + 1];
          return h - (d[1] / r);
      })
      .attr("stroke", function (d, i) {
          return "#e31e32";
      });

    //points at the value position
    svgcircle = svg.append("circle")
      .attr("class", "circle")
      .attr("cx", function (d, i) {
          return i * (w / numOflinesVisible) + leftmargin;
      })
      .attr("cy", function (d) {
          if (d[1] < 0) {
              return h;
          }
          return h - (d[1] / r);
      })
      .attr("r", 5)
      .attr("fill", function (d, i) {
          return "#e31e32";
      });

    trgt.find(".chart-tags").before("<svg class='svg2'></svg>");
    var svg2 = d3.select('#' + chartId)
      .select(".svg2");

    var svg2height = 0;
    for (var k = 0; k < linechartData.length; k++)
    {
        if (linechartData[k][0].length >= 10) {
            svg2height = 108; //12 * 9
        }
        else if (svg2height < linechartData[k][0].length * 9)
        {
            svg2height = linechartData[k][0].length * 9;
        }
    }
    svg2 = svg2.attr("height", svg2height)
      .attr("width", w + leftmargin)
      .selectAll("g")
      .data(linechartData)
      .enter()
      .append("g")
      .attr("val", function (d) {
          return d[0];
      });

    //xaxis-label is added when there is no xaxis 
    xAxislabel = svg2.append("text")
      .attr("class", "bottom-label")
      .text(function (d) {
          if (d[0].length >= 12) {
              return d[0].substring(0, 10) + "..";
          }
          return d[0];
      })
      .attr("y", function (d, i) {
          return i * (w / numOflinesVisible) + leftmargin + 2.5; //5/2 because of the radius
          ;
      })
      .attr("x", function (d) {
          return 0;
      })
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)");
    updateline(1);
    trgt.find(".col-name").on("change", function ()
    {
        updateline($(this).val());
    });
    trgt.on("click", ".move-left", function () {
        update(37);
    });
    trgt.on("click", ".move-right", function () {
        update(39);
    });

    function updateline(clnm) {
        colnum = clnm;
        if (max_neg[clnm] < 0)
            neg_ht = (-max_neg[clnm] / maxval[clnm]) * h;
        else
            neg_ht = 0;
        r = maxval[clnm] / h;
        r = r * 1.15; //this is for some top padding     

        svgcircle.transition()
          .duration(500)
          .ease('bounce')
          .attr("cy", function (d) {
              return (h - neg_ht) - (d[clnm] / r);
          })
          .attr("r", 5)
          .attr("v", function (d) {
              return d[clnm];
          });

        svgline.transition()
          .delay(function (d, i) {
              return 50;/*return i * 100; */
          })
          .duration(400)
          .ease('bounce')
          .attr("y1", function (d) {
              return (h - neg_ht) - (d[clnm] / r);
          })
          .attr("y2", function (d, i) {
              if (i == linechartData.length - 1)
              {
                  return (h - neg_ht) - (d[clnm] / r);
              }
              d = linechartData[i + 1];
              return (h - neg_ht) - (d[clnm] / r);
          });

        //height(y axis) ratio is calculated based on max value 
        trgt.find(".yaxis").remove();
        //yaxis is created
        buildYaxis(max_neg[clnm], maxval[clnm], (h - neg_ht), chartId, h, w, leftmargin, numOflinesVisible, 5, 'l');
        trgt.find(".tick").find("text").each(function () {
            var v = $(this).text();
            $(this).text(formatTicsText(v));
        });
        if (data[0].length == 2)
        {
            d3.select('#' + chartId)
              .select(".yaxis")
              .append("text")
              .text(data[0][1])
              .attr("x", -(h - h / 2) - 10)
              .attr("y", 15)
              .attr("id", "yaxis-title")
              .attr("text-anchor", "middle")
              .attr("transform", "rotate(-90)");
            trgt.find(".yaxis #pos-axis, .yaxis #neg-axis").attr("transform", "translate(20,0)");
        }
    }
    if (linechartData.length >= numOflinesVisible + 1)
    {
        end = 0;
        start = 0;
        var arrows = '<div class = "arrows"><a class="move-left" href="#"><i class="icon-chevron-left-sign"></i></a><a class="move-right" href="#"><i class="icon-chevron-right-sign"></i></a></div>';
        if (trgt.find(".arrows").length == 0)
        {
            trgt.find(".cht-opts").after(arrows);
        }
        //based on the key entered start, end, move values are updated
        function update(arrowKey) {
            var clnm = colnum;
            r = maxval[clnm] / h;
            r = r * 1.15; //this is for some top padding     

            if (arrowKey == 37) //if arrow key is pressed
            {
                end = 0;
                move = move - 1;
                if (move < 0)
                {
                    move = 0;
                    start = 0;
                }
            }
            if (arrowKey == 39)//if right arrow key is pressed
            {
                start++;
                if (move == linechartData.length - numOflinesVisible)
                {
                    end++;
                }
                else {
                    move = move + 1;
                }
            }
            //With the help of start, end, move values lines & its labels are updated
            if (!((move + numOflinesVisible == linechartData.length && end >= 1) || (move == 0 && start == 0)))
            {
                svgline.transition()            //adds effect to the loading data 
                  .duration(1000)
                  .attr("x1", function (d, i) {

                      return (i - move) * (w / numOflinesVisible) + leftmargin;
                  })
                  .attr("x2", function (d, i) {
                      if (i == linechartData.length - 1)
                      {
                          return (i - move) * (w / numOflinesVisible) + leftmargin;
                      }
                      return ((i + 1) - move) * (w / numOflinesVisible) + leftmargin;
                  });

                svgcircle.transition()            //adds effect to the loading data 
                  .duration(1000)
                  .attr("cx", function (d, i) {
                      return (i - move) * (w / numOflinesVisible) + leftmargin;
                  });

                xAxislabel.transition()            //adds effect to the loading data 
                  .duration(1000)
                  .attr("y", function (d, i) {
                      return (i - move) * (w / numOflinesVisible) + leftmargin + 2.5;
                  })
                  .text(function (d, i) {

                      if ((i > (move + numOflinesVisible - 1) || i < move) && arrowKey == 39)
                      {
                          return "";
                      }
                      else if ((i > (move + numOflinesVisible) || i < move) && arrowKey == 37)
                      {
                          return "";
                      }
                      else if (d[0].length >= 10) {
                          return d[0].substring(0, 8) + "..";
                      }
                      return d[0];

                  });
            }
        }
    }
    //on hover effects
    trgt.find('.svg g').on("mouseenter", function (e)
    {
        lineChartMouseEnter($(this).find(".circle").attr("v"), e, $(this).attr('id'), chartId);
    });
    trgt.find('.svg g').on("mouseleave", function ()
    {
        lineChartMouseLeave($(this).attr('id'), chartId);
    });
    trgt.find('.svg2 g').on("mouseenter", function (e)
    {
        xaxisMouseEnter($(this).attr('val'), e, chartId);
    });
    trgt.find('.svg2 g').on("mouseleave", function ()
    {
        xaxisMouseLeave(chartId);
    });
}
function groupedbarchart(d, w, h, chartId, title)
{
    var leftmargin = 50, numOfBarsVisible = 32;
    var svgtext = [], svgbar = [], xAxislabel;
    var end, start, bar_width = 0, neg_ht = 0;
    var move = 0, r = 1;
    var tmp, data = [];
    var maxval = 1, max_neg = 0;
    //json data is converted to array which can be binded to svg elements
    $.each(d, function (r, row) {
        if (row['A'] != null) {
            tmp = [];
            $.each(row, function (c, cell) {
                if (d['1'][c] != null && d['1'][c] != "" && d['1'][c] != undefined) {
                    if (c == 'A' || r == '1') {
                        cell = cell + ""; //making all xaxis values and headings as string.
                        tmp.push(cell);
                    }
                    else {
                        cell = parseFloat(cell);
                        if (cell != null && !isNaN(cell) && cell != "" && cell != undefined)
                            tmp.push(cell);
                        else {
                            if (d["1"][c] != null) {
                                cell = 0;
                                tmp.push(0);
                            }
                        }
                        if (isNaN(cell))
                            throw "'" + cell + "' not a number. All the values should be numbers only.";
                        if (r != 1) {
                            if (maxval < cell)
                                maxval = cell;
                            else if (cell < max_neg)
                                max_neg = cell;
                        }
                    }
                }
            });
            data.push(tmp);
        }
    });
    var barchartData = data.slice(1, data.length);
    var colmlength = data[0].length - 1;

    if (data.length * colmlength <= 16)
        numOfBarsVisible = 16;
    else if (data.length * colmlength <= 24)
        numOfBarsVisible = colmlength * (data.length - 1);

    if (max_neg < 0) {
        maxval = maxval - max_neg;
        neg_ht = (-max_neg / maxval) * h;
    }
    else
        neg_ht = 0;
    r = maxval / h;
    r = r * 1.15; //this is for some top padding 
    //
    //id created for chart and chart tags divisions
    var trgt = $('#' + chartId).find(".chart");
    $("#" + chartId).find(".chart-tags").attr('id', "barchart-tags");
    //Previous heading removed and new heading added(purpose: when there are radio buttons)
    $("#" + chartId).find("#chart-head").remove();
    $("#" + chartId).find("#legend").remove();
    $("#" + chartId).find("#yaxis").remove();
    $("#" + chartId).find(".arrows").remove();
    //SVG element is created below
    var svg = d3.select('#' + chartId)
      .select(".svg");

    svg = svg.attr("height", h)
      .attr("width", w + leftmargin)
      .selectAll("g")
      .data(barchartData)
      .enter()
      .append("g")
      .attr("id", function (d) {
          return d[0];
      });

    for (var k = 1; k < data[0].length; k++) {
        svgbar[k] = svg.append("rect")
          .attr("class", "r")
          .attr('y', function (d) {
              return h;
          })
          .attr('height', function (d) {
              return 0;
          })
          .attr("x", function (d, i) {
              return ((k - 1) + (i * colmlength)) * (w / numOfBarsVisible) + leftmargin - (k * 5);
          })
          .attr("width", function () {
              if (bar_width == 0)
                  bar_width = w / numOfBarsVisible - 5;
              return bar_width; //5 is padding btw two grps 
          })
          .attr("fill", function (d, i) {
              return chartclrs[(k) % chartclrs.length];
          });
        svgtext[k] = svg.append("text")
          .attr("class", "label")
          .text(function (d) {
              if (d[k] == 0)
                  return d[k];
          })
          .attr('y', function (d) {
              return (h - neg_ht);
          })
          .attr("x", function (d, i) {
              return ((k - 1) + (i * colmlength)) * (w / numOfBarsVisible) + leftmargin - (k * 5) + (bar_width / 2);
          })
          .attr("text-anchor", "middle");

        svgbar[k].transition()
          .delay(function (d, i) {
              return 50;/*return i * 100; */
          })
          .duration(400)
          .attr('y', function (d) {
              if (d[k] < 0)
                  return (h - neg_ht);
              return (h - neg_ht) - (d[k] / r);
          })
          .attr('height', function (d) {
              if (d[k] < 0)
                  return -(d[k] / r);
              return d[k] / r;
          })
          .attr("v", function (d) {
              return d[k];
          })
          .ease('bounce');

    }
    $(".gblabel").css("font-size", "0.7em");
    //line from one point(value) to other point

    trgt.find(".chart-tags").before("<svg class='svg2'></svg>");
    var svg2 = d3.select('#' + chartId)
      .select(".svg2");
    var svg2height = 0;
    for (var k = 0; k < barchartData.length; k++)
    {
        if (barchartData[k][0].length >= 10) {
            svg2height = 108; //12 * 9
        }
        else if (svg2height < barchartData[k][0].length * 9)
        {
            svg2height = barchartData[k][0].length * 9;
        }
    }
    svg2 = svg2.attr("height", svg2height)
      .attr("width", w + leftmargin)
      .selectAll("g")
      .data(barchartData)
      .enter()
      .append("g")
      .attr("val", function (d) {
          return d[0];
      });

    //xaxis-label is added when there is no xaxis 
    xAxislabel = svg2.append("text")
      .attr("class", "bottom-label")
      .text(function (d) {
          if (d[0].length >= 8) {
              return d[0].substring(0, 6) + "..";
          }
          return d[0];
      })
      .attr("y", function (d, i) {
          return (i * colmlength) * (w / numOfBarsVisible) + leftmargin + (bar_width * colmlength) / 2;
      })
      .attr("x", function (d) {
          return 0;
      })
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)");

    trgt.find(".yaxis").remove();
    //yaxis is created 
    buildYaxis(max_neg, maxval, (h - neg_ht), chartId, h, w, leftmargin, (numOfBarsVisible / colmlength), (bar_width * colmlength) / 2, 'gb');
    trgt.find(".tick").find("text").each(function () {
        var v = $(this).text();
        $(this).text(formatTicsText(v));
    });

    trgt.on("click", ".move-left", function () {
        update(37);
    });
    trgt.on("click", ".move-right", function () {
        update(39);
    });

    if (barchartData.length * colmlength > numOfBarsVisible)
    {
        end = 0;
        start = 0;
        var arrows = '<div class = "arrows"><a class="move-left" href="#"><i class="icon-chevron-left-sign"></i></a><a class="move-right" href="#"><i class="icon-chevron-right-sign"></i></a></div>';
        if (trgt.find(".arrows").length == 0)
        {
            trgt.find(".cht-opts").after(arrows);
        }
        //based on the key entered start, end, move values are updated
        function update(arrowKey) {
            if (arrowKey == 37) //if arrow key is pressed
            {
                end = 0;
                move = move - 1;
                if (move < 0)
                {
                    move = 0;
                    start = 0;
                }
            }
            if (arrowKey == 39)//if right arrow key is pressed
            {
                start++;
                if ((move * (data[0].length - 1)) >= ((barchartData.length * (data[0].length - 1)) - numOfBarsVisible))
                {
                    end++;
                }
                else {
                    move = move + 1;
                }
            }
            //With the help of start, end, move values lines & its labels are updated
            if (!((move + numOfBarsVisible >= (barchartData.length * colmlength) && end >= 1) || (move == 0 && start == 0)))
            {
                for (var k = 1; k < data[0].length; k++) {
                    svgbar[k].transition()            //adds effect to the loading data 
                      .duration(1000)
                      .attr("x", function (d, i) {
                          //end = ((k-1)+(i*colmlength))* (w / numOfBarsVisible) + leftmargin + (i*barPadding);
                          return  ((k - 1) + ((i - move) * colmlength)) * (w / numOfBarsVisible) + leftmargin - (k * 5);
                      });
                    xAxislabel.transition()            //adds effect to the loading data 
                      .duration(1000)
                      .attr("y", function (d, i) {
                          //return (i - move) * (w/ numOfBarsVisible) + leftmargin;
                          return ((i - move) * colmlength) * (w / numOfBarsVisible) + leftmargin + (bar_width * colmlength) / 2;
                      });
                    svgtext[k].transition()            //adds effect to the loading data 
                      .duration(1000)
                      .attr("x", function (d, i) {
                          return ((k - 1) + ((i - move) * colmlength)) * (w / numOfBarsVisible) + leftmargin - (k * 5) + (bar_width / 2);
                      });
                }
            }
        }
    }
    showTags(data, "gb", chartId, title);
    //on hover effects
    trgt.find('.svg').find(".r").on("mouseenter", function (e)
    {
        $("#" + chartId).find(".chart").append("<p class = 'txtbx vtbx'></p>");
        var hvrbx = $("#" + chartId).find(".txtbx");
        hvrbx.html(numberFormat($(this).attr("v")));
        $("#" + chartId).find(".txtbx").css({position: 'absolute'});
        var left = parseInt($(this).attr('x')) + ($(this).attr("width") / 2);

        var width = numberFormat($(this).attr("v")).length * 10;
        if ((width + left) > $("#" + chartId).find(".chart").outerWidth()) {
            hvrbx.addClass("v-end");
            hvrbx.css({top: parseInt($(this).attr('y')) - 32 + trgt.find(".cht-opts").outerHeight() + trgt.find(".arrows").outerHeight(), right: ($("#" + chartId).find(".chart").outerWidth() - left - 8), width: width});
        }
        else {
            left = parseInt($(this).attr('x')) - (hvrbx.outerWidth() / 2) + ($(this).attr("width") / 2);
            hvrbx.removeClass("v-end");
            hvrbx.css({top: parseInt($(this).attr('y')) - 32 + trgt.find(".cht-opts").outerHeight() + trgt.find(".arrows").outerHeight(), left: left});
        }

        $(this).css("opacity", "0.8");
        $(this).next().css("font-size", "0.85em");
    });
    trgt.find('.svg').find(".r").on("mouseleave", function ()
    {
        $(this).css("opacity", "1");
        $(this).next().css("font-size", "0.7em");
        $("#" + chartId).find(".txtbx").remove();
    });
    trgt.find('.svg2 g').on("mouseenter", function (e)
    {
        xaxisMouseEnter($(this).attr('val'), e, chartId);
    });
    trgt.find('.svg2 g').on("mouseleave", function ()
    {
        xaxisMouseLeave(chartId);
    });
}
function groupedlinechart(d, w, h, chartId, title)
{
    var leftmargin = 50, numOflinesVisible = 16;
    var svgline = [], svgcircle = [], xAxislabel;
    var end, start, neg_ht = 0;
    var move = 0, r = 1, cr = 5;
    var tmp, data = [];
    var maxval = 1, max_neg = 0;
    //json data is converted to array which can be binded to svg elements
    $.each(d, function (r, row) {
        if (row['A'] != null) {
            tmp = [];
            $.each(row, function (c, cell) {
                if (d['1'][c] != null && d['1'][c] != "" && d['1'][c] != undefined) {
                    if (c == 'A' || r == '1') {
                        cell = cell + ""; //making all xaxis values and headings as string.
                        tmp.push(cell);
                    }
                    else {
                        cell = parseFloat(cell);
                        if (cell != null && !isNaN(cell) && cell != "" && cell != undefined)
                            tmp.push(cell);
                        else {
                            if (d["1"][c] != null) {
                                cell = 0;
                                tmp.push(0);
                            }
                        }
                        if (isNaN(cell))
                            throw "'" + cell + "' not a number. All the values should be numbers only.";
                        if (r != 1) {
                            if (maxval < cell)
                                maxval = cell;
                            else if (cell < max_neg)
                                max_neg = cell;
                        }
                    }
                }
            });
            data.push(tmp);
        }
    });
    var linechartData = data.slice(1, data.length);

    if (data[0].length == 2) {
        leftmargin += 30;
        w = w - 30;
    }
    if (data.length <= 9) // -1 because 1st value is header-row.
        numOflinesVisible = 8;
    else if (data.length <= 17)
        numOflinesVisible = data.length - 1;

    if (max_neg < 0) {
        maxval = maxval - max_neg;
        neg_ht = (-max_neg / maxval) * h;
    }
    else
        neg_ht = 0;
    r = maxval / h;
    r = r * 1.15; //this is for some top padding  
    //id created for chart and chart tags divisions
    var trgt = $('#' + chartId).find(".chart");
    //$("#" + chartId).find(".chart-tags").attr('id', "linechart-tags");
    //Previous heading removed and new heading added(purpose: when there are radio buttons)
    $("#" + chartId).find("#chart-head").remove();
    $("#" + chartId).find("#legend").remove();
    $("#" + chartId).find("#yaxis").remove();
    $("#" + chartId).find(".arrows").remove();
    //SVG element is created below
    var svg = d3.select('#' + chartId)
      .select(".svg");

    svg = svg.attr("height", h)
      .attr("width", w + leftmargin)
      .selectAll("g")
      .data(linechartData)
      .enter()
      .append("g")
      .attr("id", function (d) {
          return d[0];
      });
    for (var k = 1; k < data[0].length; k++) {
        svgline[k] = svg.append("line")
          .attr("x1", function (d, i) {
              return i * (w / numOflinesVisible) + leftmargin;
          })
          .attr("y1", function (d) {
              return (h - neg_ht) - (d[k] / r) - cr;
          })
          .attr("x2", function (d, i) {
              if (i == linechartData.length - 1)
              {
                  return i * (w / numOflinesVisible) + leftmargin;
              }
              return (i + 1) * (w / numOflinesVisible) + leftmargin;
          })
          .attr("y2", function (d, i) {
              if (i == linechartData.length - 1)
              {
                  return (h - neg_ht) - (d[k] / r) - cr;
              }
              d = linechartData[i + 1];
              return (h - neg_ht) - (d[k] / r) - cr;
          })
          .attr("stroke", function (d, i) {
              return chartclrs[(k) % chartclrs.length];
          });

        //points at the value position
        svgcircle[k] = svg.append("circle")
          .attr("class", "circle")
          .attr("cx", function (d, i) {
              return i * (w / numOflinesVisible) + leftmargin;
          })
          .attr("cy", function (d) {
              return (h - neg_ht) - (d[k] / r) - cr;
          })
          .attr("r", cr)
          .attr("fill", function (d, i) {
              return chartclrs[(k) % chartclrs.length];
          })
          .attr("v", function (d) {
              return d[k];
          });
    }
    //line from one point(value) to other point

    trgt.find(".chart-tags").before("<svg class='svg2'></svg>");
    var svg2 = d3.select('#' + chartId)
      .select(".svg2");
    var svg2height = 0;
    for (var k = 0; k < linechartData.length; k++)
    {
        if (linechartData[k][0].length >= 10) {
            svg2height = 108; //12 * 9
        }
        else if (svg2height < linechartData[k][0].length * 9)
        {
            svg2height = linechartData[k][0].length * 9;
        }
    }
    svg2 = svg2.attr("height", svg2height)
      .attr("width", w + leftmargin)
      .selectAll("g")
      .data(linechartData)
      .enter()
      .append("g")
      .attr("val", function (d) {
          return d[0];
      });
    //xaxis-label is added when there is no xaxis 
    xAxislabel = svg2.append("text")
      .attr("class", "bottom-label")
      .text(function (d) {
          if (d[0].length >= 8) {
              return d[0].substring(0, 6) + "..";
          }
          return d[0];
      })
      .attr("y", function (d, i) {
          return i * (w / numOflinesVisible) + leftmargin + cr / 2;
      })
      .attr("x", function (d) {
          return 0;
      })
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)");

    trgt.on("click", ".move-left", function () {
        update(37);
    });
    trgt.on("click", ".move-right", function () {
        update(39);
    });
    trgt.find(".yaxis").remove();
    //yaxis is created 
    buildYaxis(max_neg, maxval, (h - neg_ht), chartId, h, w, leftmargin, numOflinesVisible, 5, 'gl');
    trgt.find(".tick").find("text").each(function () {
        var v = $(this).text();
        $(this).text(formatTicsText(v));
    });

    trgt.on("click", ".move-left", function () {
        update(37);
    });
    trgt.on("click", ".move-right", function () {
        update(39);
    });
    if (linechartData.length >= numOflinesVisible + 1)
    {
        end = 0;
        start = 0;
        var arrows = '<div class = "arrows"><a class="move-left" href="#"><i class="icon-chevron-left-sign"></i></a><a class="move-right" href="#"><i class="icon-chevron-right-sign"></i></a></div>';
        if (trgt.find(".arrows").length == 0)
        {
            trgt.find(".cht-opts").after(arrows);
        }
        var start = 0;
        //based on the key entered start, end, move values are updated
        function update(arrowKey) {
            if (arrowKey == 37) //if arrow key is pressed
            {
                end = 0;
                move = move - 1;
                if (move < 0)
                {
                    move = 0;
                    start = 0;
                }
            }
            if (arrowKey == 39)//if right arrow key is pressed
            {
                start++;
                if (move == linechartData.length - numOflinesVisible)
                {
                    end++;
                }
                else {
                    move = move + 1;
                }
            }
            //With the help of start, end, move values lines & its labels are updated
            if (!((move + numOflinesVisible == linechartData.length && end >= 1) || (move == 0 && start == 0)))
            {
                for (var k = 1; k < data[0].length; k++) {
                    svgline[k].transition()            //adds effect to the loading data 
                      .duration(1000)
                      .attr("x1", function (d, i) {

                          return (i - move) * (w / numOflinesVisible) + leftmargin;
                      })
                      .attr("x2", function (d, i) {

                          if (i == linechartData.length - 1)
                          {
                              return (i - move) * (w / numOflinesVisible) + leftmargin;
                          }

                          return ((i + 1) - move) * (w / numOflinesVisible) + leftmargin;
                      });

                    svgcircle[k].transition()            //adds effect to the loading data 
                      .duration(1000)
                      .attr("cx", function (d, i) {
                          return (i - move) * (w / numOflinesVisible) + leftmargin;
                      });

                    xAxislabel.transition()            //adds effect to the loading data 
                      .duration(1000)
                      .attr("y", function (d, i) {
                          return (i - move) * (w / numOflinesVisible) + leftmargin + cr / 2;
                      });
                }
            }
        }
    }
    showTags(data, "gl", chartId, title);//shows tags below the chart 

    //on hover effects
    trgt.find('.svg').find(".circle").on("mouseenter", function (e)
    {
        if (e != 0) {
            var offset = $("#" + chartId).find(".chart").offset();
            var relativeX = (e.pageX - offset.left);
            var relativeY = (e.pageY - offset.top - 55);
            $("#" + chartId).find(".chart").append("<p class = 'txtbx vtbx'></p>");
            var hvrbx = $("#" + chartId).find(".txtbx");
            hvrbx.html(numberFormat($(this).attr("v")));
            hvrbx.css({position: 'absolute'});

            var width = numberFormat($(this).attr("v")).length * 10;
            if ((width + relativeX) > $("#" + chartId).find(".chart").outerWidth()) {
                hvrbx.addClass("v-end");
                hvrbx.css({top: relativeY, right: ($("#" + chartId).find(".chart").outerWidth() - relativeX - 8), width: width});
            }
            else {
                relativeX = relativeX - (hvrbx.outerWidth() / 2);
                hvrbx.removeClass("v-end");
                hvrbx.css({top: relativeY, left: relativeX});
            }
        }
        $(this).css("opacity", "0.8");
        $(this).attr("r", 7);
    });
    trgt.find('.svg').find(".circle").on("mouseleave", function ()
    {
        $(this).css("opacity", "1");
        $(this).attr("r", 5);
        $("#" + chartId).find(".txtbx").remove();
    });
    trgt.find('.svg2 g').on("mouseenter", function (e)
    {
        xaxisMouseEnter($(this).attr('val'), e, chartId);
    });
    trgt.find('.svg2 g').on("mouseleave", function ()
    {
        xaxisMouseLeave(chartId);
    });
}

function piechart(d, colnum, w, h, chartId, title)
{
    var r = (h / 2) - 25;
    var ir = 0;
    var i, tmp, data = [];
    //json data is converted to array, which can be binded to svg elements 
    var trgt = $('#' + chartId).find(".chart");
    var totalSeats = {};
    // the array data is converted to pie chart convinient format  
    var clms = Object.keys(d['1']).map(function (k) {
        return d['1'][k];
    });
    for (i = clms.length - 1; i >= 0; i--) {
        if (clms[i] == null || clms[i] == "")
            clms.pop();
        else
            break;
    }
    if (clms.length > 2)
        showColumnButtons(clms.slice(1, clms.length), 'b', w, h, chartId);
    $.each(d, function (r, row) {
        if (row['A'] != null) {
            tmp = [];
            $.each(row, function (c, cell) {
                if (d['1'][c] != null && d['1'][c] != "" && d['1'][c] != undefined) {
                    if (cell < 0)
                        tmp.push(0);
                    else {
                        if (c == 'A' || r == '1') {
                            cell = cell + ""; //making all xaxis values and headings as string.
                            tmp.push(cell);
                        }
                        else {
                            cell = parseFloat(cell);
                            if (cell != null && !isNaN(cell) && cell != "" && cell != undefined)
                                tmp.push(cell);
                            else {
                                if (d["1"][c] != null) {
                                    cell = 0;
                                    tmp.push(cell);
                                }
                            }
                            if (isNaN(cell))
                                throw "'" + cell + "' not a number. All the values should be numbers only.";
                            if (r != 1) {
                                if (totalSeats[c] == undefined && !isNaN(cell))
                                    totalSeats[c] = cell;
                                else if (!isNaN(cell))
                                    totalSeats[c] = totalSeats[c] + cell;
                            }
                        }
                    }
                }
            });
            tmp.push(tmp[0]);
            tmp[0] = 0;
            tmp.push(tmp[tmp.length - 1]);
            data.push(tmp);
        }
    });
    totalSeats = Object.keys(totalSeats).map(function (k) {
        return totalSeats[k];
    });
//    if(totalSeats.length == 1 && totalSeats[0] == 0)
//      trgt.find(".err-msg").removeClass("hideElement").text("No Data.");
    var donutData = data.slice(1, data.length);
    var tmp = [];
//    for (i = 0; i <= clms.length; i++)
//      ;
    tmp.push(0);
    tmp[0] = 1;
    tmp.push(null);
    tmp.push(null);
    donutData.push(tmp);
    //asigning id to chart and chart tag divisions
    trgt.find(".chart-tags").attr('id', "piechart-tags");
    trgt.find(".svg").attr('id', "pie-svg");
    var pie = d3.layout.pie()
      .value(function (d) {
          return d[0];
      })
      .sort(null);
    var svg = d3.select("#" + chartId)
      .select("#pie-svg")
      .attr("height", h)
      .attr("width", w);
    trgt.find("#chart-head").empty();
    //and arc is defined and assigned to a variable 


    var arc = d3.svg.arc()
      .innerRadius(ir)
      .outerRadius(r);
    var path = svg.datum(donutData).selectAll('g')
      .data(pie)
      .enter().append('g')
      .append('path')
      .attr('fill', function (d, i) {
          return chartclrs[(i + 1) % chartclrs.length];
      })
      .attr('d', arc)
      .style('opacity', function (d) {
          return d.data[0] === 0 ? 1 : 0;
      })
      .each(function (d) {
          this._current = d;
      })
      .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");
    updatePie(1);
    trgt.find(".col-name").on("change", function ()
    {
        updatePie($(this).val());
    });
    function updatePie(clnm) {
        svg.selectAll('g')
          .attr("id", function (d, i) {
              if (d.data[clms.length + 1])
                  return d.data[clms.length + 1].replace(/[^a-zA-Z0-9]/g, "");
          })
          .attr("value", function (d, i) {
              var sectorPart = (d.data[clnm] / totalSeats[clnm - 1]) * 100;
              var v = "" + d.data[clnm];
              return d.data[clms.length] + "<br>" + numberFormat(v) + " (" + sectorPart.toFixed(2) + "%)";
          });
        // new values for transitions
        pie.value(function (d) {
            return d[clnm];
        });
        path = path.data(pie);
        path.transition().duration(1000).attrTween('d', arcTween);

        //mouse hover effects are added for the sectors
        $("#" + chartId).find(".chart .svg").find("g").on("mouseenter", function (e)
        {
            pieChartMouseEnter($(this).attr('id'), e, data, chartId, title);
        });
        $("#" + chartId).find(".chart .svg").find("g").on("mousemove", function (e)
        {
            pieChartMouseEnter($(this).attr('id'), e, data, chartId, title);
        });
        $("#" + chartId).find(".chart .svg").find("g").on("mouseleave", function ()
        {
            pieChartMouseLeave($(this).attr('id'), chartId);
        });
        //shows tags beside the chart
        showTags(data, "pie", chartId, title, clnm);
    }
    //if all the values are zero then display this msg
//    else {
//      trgt.find("#chart-head").remove();
//      trgt.find('#cht-opts').after('<p id = "chart-head">No data</p>');
//      trgt.find(".chart-tags").empty();
//    }
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        if (isNaN(i(0).value) || (isNaN(i(0).startAngle) && isNaN(i(0).endAngle)))
            return;
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    }
}
function buildYaxis(mxn, mxp, zeroth_pos, chartId, h, w, leftmargin, no_lbls, lbl_padding, ch, bpdng) {
    if (mxn < 0)
        mxp = mxp + mxn;
    var tick, tn;

    var ydomain;
    ydomain = mxp * 1.15;
    var yScale = d3.scale.linear()
      .domain([0, ydomain])
      .range([zeroth_pos, 0]);
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("right")
      .ticks(Math.ceil(zeroth_pos / 70));
    $("#" + chartId).find('.svg').prepend("<svg class='yaxis'></svg>");
    var Yaxis = d3.select('#' + chartId)
      .select(".yaxis")
      .attr("height", h)
      .append("g")
      .attr("class", "axis")
      .attr("id", "pos-axis")
      .attr("transform", "translate(0 ,0)")
      .call(yAxis);

    ydomain = mxn * 1.15;
    yScale = d3.scale.linear()
      .domain([0, ydomain])
      .range([zeroth_pos, h]);
    yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("right")
      .ticks(Math.ceil((h - zeroth_pos) / 70));
    Yaxis.append("g")
      .attr("class", "axis")
      .attr("id", "neg-axis")
      .attr("transform", "translate(0 ,0)")
      .call(yAxis);
    $(".tick").find("text").attr("y", -7);
    $(".tick").find("text").attr("x", 4);
    $(".tick").find("line").attr("x1", 6);
    $(".tick").find("line").attr("x2", w + leftmargin);

    //axis line 
    tick = Yaxis.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0 ,0)")
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0 ," + (h - 1) + ")");
    tick.append("line")
      .attr("x1", 0)
      .attr("x2", w + leftmargin)
      .attr("y2", 0);

    if (leftmargin > 50)
        leftmargin = leftmargin - 20;

    for (tn = 1; tn <= no_lbls; tn++) {
        tick.append("text")
          .attr("x", function () {
              if (ch == 'b')
                  return (tn - 1) * ((w + bpdng) / no_lbls) + leftmargin + lbl_padding;
              return (tn - 1) * (w / no_lbls) + leftmargin + lbl_padding - 7;
          })
          .attr("y", 7)
          .text("I")
          .attr("text-anchor", "start");
    }
}
function chooseChart(data, col_num, chart, w, h, chartId, title)
{
    $('#' + chartId).find(".svg, .chart-tags , .svg2, .cht-opts").empty();
    $('#' + chartId).find(".svg2").remove();
    if (chart == "b")
        barchart(data, col_num, w, h, chartId, title);
    else if (chart == "p")
        piechart(data, col_num, w, h, chartId, title);
    else if (chart == "gb")
        groupedbarchart(data, w, h, chartId, title);
    else if (chart == "l")
        linechart(data, col_num, w, h, chartId, title);
    else if (chart == "gl")
        groupedlinechart(data, w, h, chartId, title);
}
function showColumnButtons(columnbuttons, chart, w, h, chartId, title) {
    var trgt = $("#" + chartId).find('.cht-opts');
    trgt.empty();
    if (columnbuttons)
    {
        if (columnbuttons.length > 10 && (chart == 'l' || chart == 'b' || chart == 'p')) {
            var tmp = "<label>Change data : </label><select class = 'col-name'>";
            for (var i = 0; i < columnbuttons.length; i++) {
                tmp = tmp + "<option name='col-name-" + chartId + "' value='" + (i + 1) + "' >" + columnbuttons[i] + "</option>";
            }
            tmp = tmp + "</select>";
            trgt.append(tmp);
        }
        else if (columnbuttons.length > 1 && (chart == 'l' || chart == 'b' || chart == 'p')) {
            for (var i = 0; i < columnbuttons.length; i++) {
                if (i == 0) {
                    if (columnbuttons[i] != null)
                        trgt.append("<li class='slct transition in'><input type='radio' class = 'col-name' name='col-name-" + chartId + "' id='col-name-" + chartId + i + "' value='" + (i + 1) + "' checked/><label for='col-name-" + chartId + i + "'>" + columnbuttons[i] + "</label></li>");
                }
                else {
                    if (columnbuttons[i] != null)
                        trgt.append("<li class='transition in'><input type='radio' class = 'col-name' name='col-name-" + chartId + "' id='col-name-" + chartId + i + "' value='" + (i + 1) + "'/><label for='col-name-" + chartId + i + "'>" + columnbuttons[i] + "</label></li>");
                }
            }
        }
    }
}
function showTags(data, chart, chartId, title, colnum) {
    var trgt = $('#' + chartId).find(".chart");
    trgt.find(".chart-tags").empty();
    if (chart == "gb" || chart == "gl")
    {
        for (var i = 1; i < data[0].length; i++)
        {
            tgclr = chartclrs[(i) % chartclrs.length];
            trgt.find(".chart-tags").append("<li class='tag' id = '" + data[0][i].replace(/[^a-zA-Z0-9]/g, "") + "' style = 'background-color :" + tgclr + "; '>" + data[0][i] + "</li>");
        }
    }
    else if (chart == "pie")
    {
        for (i = 1; i < data.length; i++)
        {
            // if ((data[i]["y"][colnum - 1]) != 0) {
            var tgclr;
            tgclr = chartclrs[(i) % chartclrs.length];
            trgt.find(".chart-tags").append("<li class='tag' id = '" + data[i][data[i].length - 1].replace(/[^a-zA-Z0-9]/g, "") + "' style = 'background-color :" + tgclr + "; '>" + data[i][data[i].length - 2] + "</li>");
            //  }
        }
        $(".tag").on("mouseenter", function (e)
        {
            pieChartMouseEnter($(this).attr('id'), 0, data, chartId, title);
        });
        $(".tag").on("mouseleave", function ()
        {
            pieChartMouseLeave($(this).attr('id'), chartId);
        });
    }
}
function barChartMouseEnter(v, x, h, e, id, chartId, w) {
    if (e != 0) {
        $("#" + chartId).find(".chart").append("<p class = 'txtbx vtbx'></p>");
        var hvrbx = $("#" + chartId).find(".txtbx");
        hvrbx.html(numberFormat(v));
        $("#" + chartId).find(".txtbx").css({position: 'absolute'});
        var left = parseInt(x) + (w / 2);
        var width = numberFormat(v).length * 10;
        if ((width + left) > $("#" + chartId).find(".chart").outerWidth()) {
            hvrbx.addClass("v-end");
            hvrbx.css({bottom: parseInt(h) + 30, right: ($("#" + chartId).find(".chart").outerWidth() - left - 8), width: width});
        }
        else {
            left = parseInt(x) - (hvrbx.outerWidth() / 2) + (w / 2);
            hvrbx.removeClass("v-end");
            hvrbx.css({bottom: parseInt(h) + 30, left: left});
        }
    }
    $("#" + chartId).find(".chart .svg").find("#" + id + "").find(".r").css("opacity", "0.9");
}
function barChartMouseLeave(id, chartId) {
    $("#" + chartId).find(".chart .svg").find("#" + id + "").find(".r").css("opacity", "1");
    $("#" + chartId).find(".chart .svg").find("#" + id + "").find(".bottom-label").css("fill", "#404244").attr('class', 'transition in')
      .css("font-size", "1em");
    $("#" + chartId).find(".txtbx").remove();
}
function lineChartMouseEnter(v, e, id, chartId) {
    if (e != 0) {
        var offset = $("#" + chartId).find(".chart").offset();
        var relativeX = (e.pageX - offset.left);
        var relativeY = (e.pageY - offset.top - 64);
        $("#" + chartId).find(".chart").append("<p class = 'txtbx vtbx'></p>");
        var hvrbx = $("#" + chartId).find(".txtbx");
        hvrbx.html(numberFormat(v));
        $("#" + chartId).find(".txtbx").css({position: 'absolute'});
        var width = numberFormat(v).length * 10;
        if ((width + relativeX) > $("#" + chartId).find(".chart").outerWidth()) {
            $("#" + chartId).find(".txtbx").addClass("v-end");
            $("#" + chartId).find(".txtbx").css({top: relativeY, right: ($("#" + chartId).find(".chart").outerWidth() - relativeX - 8), width: width});
        }
        else {
            relativeX = relativeX - (hvrbx.outerWidth() / 2);
            $("#" + chartId).find(".txtbx").removeClass("v-end");
            $("#" + chartId).find(".txtbx").css({top: relativeY, left: relativeX});
        }
    }
    $("#" + chartId).find(".chart .svg").find("#" + id + "").find(".circle").css("opacity", "0.8");
    $("#" + chartId).find(".chart .svg").find("#" + id + "").find(".circle").attr("r", 8);
}
function lineChartMouseLeave(id, chartId) {
    $("#" + chartId).find(".chart .svg").find("#" + id).find(".circle").css("opacity", "1");
    $("#" + chartId).find(".chart .svg").find("#" + id).find(".circle").attr("r", 5);
    $("#" + chartId).find(".txtbx").remove();
}
function pieChartMouseEnter(id, e, data, chartId, title) {
    var trgt = $("#" + chartId).find(".chart");
    if (e != 0) {
        var offset = trgt.offset();
        var relativeX = (e.pageX - offset.left + 20);
        var relativeY = (e.pageY - offset.top - 40);
//    if (data.length >= 4)
//    {
        if (data[0].length == 1)
            var v = $("#" + chartId).find(".chart .svg").find("#" + id).attr("value") + " " + data[0][0];
        else
            v = $("#" + chartId).find(".chart .svg").find("#" + id).attr("value");
        trgt.append("<p class = 'txtbx pie-bx'></p>");
        trgt.find(".txtbx").html(v);
        trgt.find(".txtbx").css({top: relativeY, left: relativeX, position: 'absolute'});
//    }
    }
    trgt.find(".svg").find("#" + id).css("opacity", "0.9");
    trgt.find(".svg").find("#" + id).find("text").css("fill", "white").attr('class', 'transition in');
}
function pieChartMouseLeave(id, chartId) {
    var trgt = $("#" + chartId).find(".chart");
    trgt.find(".txtbx").remove();
    trgt.find(".svg").find("#" + id + "").css("opacity", "1");
    trgt.find(".svg").find("#" + id + "").find("text").css("fill", "white")
      .css("font-size", "1em");
}
function xaxisMouseEnter(hovertext, e, chartId) {
    if (e != 0) {
        var offset = $("#" + chartId).find(".chart").offset();
        var relativeX = (e.pageX - offset.left + 20);
        var relativeY = (e.pageY - offset.top - 40);
        var width = hovertext.length * 10;
        $("#" + chartId).find(".chart").append("<p class = 'txtbx'></p>");
        if ((width + relativeX) > $("#" + chartId).find(".chart").outerWidth()) {
            $("#" + chartId).find(".txtbx").addClass("x-end");
            $("#" + chartId).find(".txtbx").css({top: relativeY, right: ($("#" + chartId).find(".chart").outerWidth() - relativeX + 36), position: 'absolute', width: width});
        }
        else {
            $("#" + chartId).find(".txtbx").removeClass("x-end");
            $("#" + chartId).find(".txtbx").css({top: relativeY, left: relativeX, position: 'absolute'});
        }

        $("#" + chartId).find(".txtbx").html(hovertext);

    }
}
function xaxisMouseLeave(chartId) {
    var trgt = $("#" + chartId);
    trgt.find(".txtbx").remove();
}
function numberFormat(v) {
    var neg = false;
    if (v < 0) {
        v = -v;
        neg = true;
    }
    if (!(v % 1 == 0)) {   //v attr val is taking 0.0001 value less than the given(for float values)
        v = parseFloat(v) + 0.0001;
        v = v.toFixed(2) + "";
    }
    else
        v = v + '';
    v = v.split(".");
    var k = v[0];
    var fmtV = "";
    for (var i = k.length - 1, j = 0; i >= 0; i--, j++) {
        if (j == 3 || j == 5 || j == 7 || j == 9)
            fmtV = fmtV + ",";
        fmtV = fmtV + k[i];
    }
    v[0] = fmtV.split("").reverse().join("");
    v = v.join(".");
    if (neg == true)
        return '-' + v;
    return v;
}
function formatTicsText(v) {
    var neg = false;
    v = v.replace(/,/g, '');
    var t = parseInt(v);
    if (t < 0) {
        t = -t;
        neg = true;
    }
    if (t <= 1000)
        v = t;
    else if (t > 1000 && t <= 100000)
        v = (t / 1000).toFixed(2) + "K";
    else if (t > 100000 && t <= 10000000)
        v = (t / 100000).toFixed(2) + "L";
    else if (t > 10000000 && t <= 1000000000)
        v = (t / 10000000).toFixed(2) + "C";
    else if (t > 1000000000)
        v = (t / 1000000000).toFixed(2) + "B";
    if (neg == true)
        return "-" + v;
    return v;
}
// Toggle .slct class based on the radio button selected in .cht-opts
$('.stry').on('change', '.cht-opts input[type="radio"]', function () {
    $(this).parent().parent().addClass('slct').siblings().removeClass('slct');
});

});