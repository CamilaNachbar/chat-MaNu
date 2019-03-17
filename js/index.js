var d, h, m, i = 0;
var sessionId = null;
var state = 'hide';

$(document).ready(function () {
    setTimeout(function () {
        $('.panel').hide();
    }, 100);
});


// Load google charts
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Work', 8],
        ['Eat', 2],
        ['TV', 4],
        ['Gym', 2],
        ['Sleep', 8]
    ]);

    // Optional; add a title and set the width and height of the chart
    var options = { 'title': 'My Average Day', 'width': 200, 'height': 160 };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
}

//014991060436

function setDate() {
    d = new Date()
    m = d.getMinutes();
    if (m <= 9)
        m = '0' + m;
    return '<div class="timestamp">' + d.getHours() + ':' + m + '</div>';
}

function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
        return false;
    }
    $('<div class="col-sm-12"><div class="col-sm-2 text-left timer">' + setDate() + '</div><div class="well well-sm col-sm-10">' + msg + '</div></div>').appendTo($('.panel-body')).addClass('new');
    $('.message-input').val(null);
    sendMessage(msg);
}

$('.message-submit').click(function () {
    insertMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        insertMessage();
        return false;
    }
})

function startBot() {
    sendMessage('start');
};

function sendMessage(textToSend) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:8080/assistant",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "3b6719f1-baed-39f0-d89c-5f6c1f7f522e"
        },
        "processData": false,
        "data": '{"text":"' + textToSend + '", "sessionId":' + JSON.stringify(sessionId) + '}'
    };

    $.ajax(settings).done(function (data) {
        sessionId = data.sessionId;
        console.log(data);
        $('.message.loading').remove();
        $.each(data.output.generic, function (i, item) {
            $('<div class="col-sm-12"><div class="well well-sm col-sm-10 resp">' + item.text + '</div><div class="col-sm-2 timer">' + setDate() + '</div></div>').appendTo($('.panel-body'));
            var lnk = $(".resp > a").attr("href");

            if (lnk != null && lnk !== 'undefined' && !lnk.includes("javascript")) {
                //  $(".resp > a").attr("href", 'javascript:updateFrame("'+lnk+'")');
                $(".resp > a").attr("target", '_blank');
            }
            setDate();
            scrollMessages();
        });

        if (data.output.actions) {
            var btns = '<div class="btn-group-vertical col-sm-12">';
            $.each(data.output.actions, function (i, item) {
                btns += ' <button type="button" class="btn btn-default col-sm-12" onclick="sendMessage(\'' + item.payload + '\');">' + item.title + '</button>';
            });
            btns += '</div><div class="col-sm-12">&nbsp;</div> ';
            $('<div class="col-sm-12">' + btns + '</div>').appendTo($('.panel-body'));
            scrollMessages();
        }
        console.log(data.output.chart)
        if (data.output.chart === 'chart-transporte') {
            var btns = '<img style="max-height: 160px;" src="css/uber.jpeg"> Seu consumo foi reduzido nos ultimos meses desde janeiro/2018, esse mês teve uma nova alta. Dica: Lembre-se de sempre buscar a utilização do serviço fora dos horarios de pico e chuva';
            $('<div class="col-sm-12">' + btns + '</div>').appendTo($('.panel-body'));


        }

        if (data.output.chart === 'chart') {
            var btns = 'ALIMENTAÇÃO/REFEIÇÃO <img style="max-height: 160px;" src="css/refeicao.jpeg"> seu gastos com alimentação aumentaram 90% desde agst0/2017' +
                '<br><br>TRANSPORTE <img style="max-height: 160px;" src="css/uber-unico.jpg">   Seu consumo foi reduzido nos ultimos meses desde janeiro/2018, esse mês teve uma nova alta. Dica: Lembre-se de sempre buscar a utilização do serviço fora dos horarios de pico e chuva <br><br>'
                +'Para chegar no seu objetivo deve diminuir os gastos em 30% nos proximos meses '
                +'<img style="max-height: 160px;" src="css/perfil.jpeg"> Traçando seu perfil de consumo, deve manter seus gastos abaixo da minha verde.';
            $('<div class="col-sm-12">' + btns + '</div>').appendTo($('.panel-body'));


        }
    });
}



function updateFrame(lnk) {
    $('.frame').attr('src', lnk);
}


$('.bot-btn').click(
    function () {
        if (state === 'hide') {
            $('.panel').show(1000);
            startBot();
            state = 'show'
        }
        else {
            $('.panel').hide(1000);
            state = 'hide'
        }
    }
);

function scrollMessages() {
    var wtf = $('.panel-body');
    var height = wtf[0].scrollHeight;
    wtf.scrollTop(height);
}