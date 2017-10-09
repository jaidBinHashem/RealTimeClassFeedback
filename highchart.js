Highcharts.chart('container', {

    title: {
        text: 'Lecture-001'
    },

    subtitle: {
        text: 'MD. jaid Bin Hashem'
    },

    yAxis: {
        title: {
            text: 'Number of rattings'
        }
    },
    xAxis: {
        title: {
            text: 'Ratting Values'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 1
        }
    },

    series: [{
        name: 'Topic-001',
        data: [0, 2, 3, 5, 9]
    }, {
        name: 'Topic-002',
        data: [0, 3, 3, 7, 7]
    }, {
        name: 'Topic-003',
        data: [0, 2, 3, 8, 5]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});