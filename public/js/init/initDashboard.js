function initChartsCurtidas(data){
			// dataCurtidasChart = JSON.parse('<%- JSON.stringify(curtidaCharts) %>');
	dataCurtidasChart = data;

    optionsDailySalesChart = {
    	lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        low: 0,
        // high: <%= curtidaCharts.high %>, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        high: data.high,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        height: '300px'
    }

    var curtidasCharts = new Chartist.Bar('#curtidasCharts', dataCurtidasChart, optionsDailySalesChart);

    md.startAnimationForLineChart(curtidasCharts);

}

function initChartsDeslike(data){
	dataChart = data;

    optionsChart = {
    	lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        low: 0,
        high: data.high,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        height: '300px'
    }

    var charts = new Chartist.Bar('#deslikeCharts', dataChart, optionsChart);

    md.startAnimationForLineChart(charts);

}

function initChartsAirtimes(data){
	// dataAirtimeChart = JSON.parse(data);
	dataAirtimeChart = data;

    optionsDailySalesChart = {
    	lineSmooth: Chartist.Interpolation.cardinal({
			tension: 10
		}),
		axisY: {
			showGrid: true,
			offset: 40
		},
		axisX: {
			showGrid: false,
		},
		low: 0,
		high: data.high,
		showPoint: true,
		height: '300px'
    }

    var airtimeCharts = new Chartist.Line('#airtimeCharts', dataAirtimeChart, optionsDailySalesChart);

    md.startAnimationForLineChart(airtimeCharts);

}

function initChartsOuvintes(data){
	// dataAirtimeChart = JSON.parse(data);
	dataOuvinteChart = data;

    optionsDailySalesChart = {
    	lineSmooth: Chartist.Interpolation.cardinal({
			tension: 10
		}),
		axisY: {
			showGrid: true,
			offset: 40
		},
		axisX: {
			showGrid: false,
		},
		low: 0,
		high: data.high,
		showPoint: true,
		height: '300px'
    }

    var ouvinteCharts = new Chartist.Line('#ouvinteCharts', dataOuvinteChart, optionsDailySalesChart);

    md.startAnimationForLineChart(ouvinteCharts);

}

function initChartsAirtimesByPeriodo(){

	let dtInicial = new Date();
	let dtFinal = new Date();
	let tmpI = $('#id-dt-inicial').val();
	let tmpF = $('#id-dt-final').val();

	let dia = tmpI.substring(0, 2);
	let mes = tmpI.substring(3, 5);
	let ano = tmpI.substring(6, 10);
	dtInicial.setDate(dia);
	dtInicial.setMonth(parseInt(mes) - 1);
	dtInicial.setFullYear(ano);

	dia = tmpF.substring(0, 2);
	mes = tmpF.substring(3, 5);
	ano = tmpF.substring(6, 10);
	dtFinal.setDate(dia);
	dtFinal.setMonth(parseInt(mes) - 1);
	dtFinal.setFullYear(ano);
	
	
	// console.log('datainicial', dtInicial);
	// console.log('datafinal', dtFinal);

	var vai = {data_inicial: dtInicial, data_final: dtFinal};

	const request = $.ajax({
        url: '/airtime',
        type: 'POST',
        data: vai,
        // contentType: "application/json"
    });
    

    request.done(function (msg) {
        // console.log('getAirtimes() done');
        // console.log(msg);
        let ac = JSON.parse(msg);
        initChartsAirtimes(ac.airtimeCharts);
    });

    request.fail(function (jqXHR, textStatus) {
        console.log('erro');
        console.log(jqXHR);
        console.log(textStatus);
        //swal("Erro!", textoErro1.textStatus, "error");
    });
}


function initChartsOuvintesByPeriodo(){
	// console.log("id-ips:", $("#id-ips").val());
	let selectIps = $("#id-ips").val();
	let dtInicial = new Date();
	let dtFinal = new Date();
	let tmpI = $('#id-dt-o-inicial').val();
	let tmpF = $('#id-dt-o-final').val();

	let dia = tmpI.substring(0, 2);
	let mes = tmpI.substring(3, 5);
	let ano = tmpI.substring(6, 10);
	dtInicial.setDate(dia);
	dtInicial.setMonth(parseInt(mes) - 1);
	dtInicial.setFullYear(ano);

	dia = tmpF.substring(0, 2);
	mes = tmpF.substring(3, 5);
	ano = tmpF.substring(6, 10);
	dtFinal.setDate(dia);
	dtFinal.setMonth(parseInt(mes) - 1);
	dtFinal.setFullYear(ano);

	if(dtInicial.getDate() === dtIniOuvi.getDate() &&
		dtInicial.getMonth() === dtIniOuvi.getMonth() &&
		dtInicial.getFullYear() === dtIniOuvi.getFullYear() &&
		dtFinal.getDate() === dtFinOuvi.getDate() &&
		dtFinal.getMonth() === dtFinOuvi.getMonth() &&
		dtFinal.getFullYear() === dtFinOuvi.getFullYear()) {

		let newdata = {};
		newdata.labels = ouvinteCharts.labels;
		newdata.series = [];

		console.log('ouvinteCharts', ouvinteCharts);

		for(var i = 0; i < selectIps.length; i++){
			for(var j = 0; j < ouvinteCharts.ips.length; j++){
				if(selectIps[i] === ouvinteCharts.ips[j].ip){
					newdata.series.push(ouvinteCharts.ips[j].serie);
				}
			}
		}
		newdata.high = ouvinteCharts.high;
		console.log(newdata);
		initChartsOuvintes(newdata);

	} else {
		var vai = {data_inicial: dtInicial, data_final: dtFinal, ips: selectIps};
		
		dtIniOuvi = dtInicial;
		dtFinOuvi = dtFinal;
		
		const request = $.ajax({
            url: '/ouvinte',
            type: 'POST',
            data: vai,
        });
        

        request.done(function (msg) {
            // console.log('getAirtimes() done');
            // console.log(msg);
            let oc = JSON.parse(msg);
            ouvinteCharts = oc.ouvinteCharts;
            initChartsOuvintes(oc.ouvinteCharts);
        });

        request.fail(function (jqXHR, textStatus) {
            console.log('erro');
            console.log(jqXHR);
            console.log(textStatus);
            //swal("Erro!", textoErro1.textStatus, "error");
        });
    }
	
}

var dtIniOuvi = new Date();
var dtFinOuvi = new Date();
var ouvinteCharts = {};