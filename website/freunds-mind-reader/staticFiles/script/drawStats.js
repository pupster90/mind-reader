





/////////////////////////////////////
////////   Draw Charts      ////////
///////////////////////////////////



google.charts.load('current', {'packages':['corechart', 'bar','annotationchart']});
google.charts.setOnLoadCallback(drawChart);


function drawChart(){
    // Pie Chart of game outcomes
    var data = google.visualization.arrayToDataTable([
      ['Outcome', 'Count'],
      ['Won',       Number(document.getElementById('winner').innerHTML)  ],
      ['Lost',      Number(document.getElementById('loser').innerHTML)   ],
      ['Timed Out', Number(document.getElementById('timedOut').innerHTML)],
      ['Cheater',   Number(document.getElementById('cheater').innerHTML) ],
      ['Unfinished',Number(document.getElementById('unfinished').innerHTML) ]
    ]);
    var chart = new google.visualization.PieChart(document.getElementById('outcomes'));
    chart.draw(data);

    // Chart of Scores over Time
    var data1 = new google.visualization.DataTable();
    data1.addColumn('date', 'Date');
    data1.addColumn('number', 'Points');
    dates_scores = []
    for( i=0; i< Number(document.getElementById('hist_len').value) ; i++){
        date=( new Date( document.getElementById('hist_date'+i).value )  )
        score= Number(document.getElementById('hist_score'+i).value )
        dates_scores.push( [date,score ]  )
    }
    data1.addRows(dates_scores);
    var chart1 = new google.visualization.AnnotationChart(document.getElementById('dates_scores'));
    var options1 = { displayAnnotations: false }; //, annotationsWidth: 70, title: 'Number of Games Played'
    chart1.draw(data1, options1);


    // Chart Showing Current Games Scores
      var data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Time of Day');
      data.addColumn('number', 'Motivation Level');
      var data = google.visualization.arrayToDataTable([
        ['Time', 'Points'],
        ['Hour', Number(document.getElementById('scoreHour').innerHTML) ],
        ['Day',  Number(document.getElementById('scoreDay').innerHTML)  ],
        ['Month',Number(document.getElementById('scoreMonth').innerHTML)],
        ['Total',Number(document.getElementById('score').innerHTML)]
      ]);
      var options = { hAxis: { title: 'Time' },  vAxis: { title: 'Points' }, bar: {groupWidth: "95%"},  legend: { position: "none" } };
      var chart = new google.visualization.ColumnChart(
      document.getElementById('current_scores'));
      chart.draw(data, options)

}

















