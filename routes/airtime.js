const express         = require('express');
const router 	      = express.Router();
const service_airtime = require('../service/service-airtime');

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/users/login?fail=true');
  }
}

router.post('/', authenticationMiddleware(), function(req, res, next) {
	
	try {
		// console.log('body', req.body);

		// console.log('before.data_inicial', req.body.data_inicial);
		// console.log('before.data_final', req.body.data_final);

		// console.log('before.new Date.data_inicial', new Date(req.body.data_inicial));
		// console.log('before.new Date.data_final', new Date(req.body.data_final));
		let dtI = new Date(req.body.data_inicial);
		let dtF = new Date(req.body.data_final);

		let data_inicial = {
			dia: dtI.getDate(),
			mes: dtI.getMonth(),
			ano: dtI.getFullYear()
		}

		let data_final = {
			dia: dtF.getDate(),
			mes: dtF.getMonth(),
			ano: dtF.getFullYear()
		}

		service_airtime.findByDataInclusaoBetween(data_inicial, data_final,
			(err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ message: "service_curtidas.findByAudio não localizado", error: err }));
			
				// console.log('findByDataInclusaoBetweenAirtime', result);

				let airtimes = result;
				let airtime = {};
				let labels = [];
				let series = [];
				let maxList = 0;
				for (var i = 0, len = airtimes.length; i < len; i++) {
					labels.push(airtimes[i]._id.day + "/" + airtimes[i]._id.month + "/" + airtimes[i]._id.year);
					series.push(airtimes[i].listenersMax);
					if(airtimes[i].listenersMax > maxList){
						maxList = airtimes[i].listenersMax;
					}
				}
				airtime.labels = labels;
				airtime.series = [];
				airtime.series.push(series);
				airtime.high = maxList;
				airtime.data_inicial = dtI.getDate() + "/" + (dtI.getMonth() + 1) + "/" + dtI.getFullYear();
				airtime.data_final = dtF.getDate() + "/" + (dtF.getMonth() + 1) + "/" + dtF.getFullYear();
				
				return res.status(200).end(JSON.stringify({ airtimeCharts: airtime, message: result }));
			});
	} catch (e) {
		return res.status(500).end(JSON.stringify({ message: 'findByDataInclusaoBetween', error: e }));
	}
	
})


router.get('/allGroupBy/:ano', authenticationMiddleware(), function(req, res, next) {
	try {
		const ano = parseInt(req.params.ano);

		service_airtime.findAllGroupBy(
			(err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ message: "service_curtidas.findAllGroupBy não localizado", error: err }));
			
				let airtimes = [];
				console.log('ano', ano);
				for (var i = 0, len = result.length; i < len; i++) {
					console.log('year', result[i]._id.year);
					if(ano === parseInt(result[i]._id.year)){
						
						airtimes.push(result[i]);
					}
				}


				let airtime = {};
				let labels = [];
				let series = [];
				let anos = [];
				let maxList = 0;
				let label = "";
				if (airtimes){
					label = airtimes[0]._id.month + "/" + airtimes[0]._id.year;
					labels.push(label);
				}
				
				let totalPorMes = 0;
				for (var i = 0, len = airtimes.length; i < len; i++) {
					if (anos.indexOf(airtimes[i]._id.year) == -1){
						anos.push(airtimes[i]._id.year);
					}
					if(label === airtimes[i]._id.month + "/" + airtimes[i]._id.year){
						totalPorMes += parseInt(airtimes[i].listenersMax);
					} else {
						label = airtimes[i]._id.month + "/" + airtimes[i]._id.year;
						labels.push(label);
						series.push(totalPorMes);
						totalPorMes = parseInt(airtimes[i].listenersMax);
					}
					
					if(totalPorMes > maxList){
						maxList = totalPorMes;
					}
				}
				//Quando so tem 1 mes
				if (airtimes){
					series.push(totalPorMes);
				}

				for(var i = 0; i < labels.length; i++){
					labels[i] = labels[i] + " (" + series[i] + ")";
				}

				airtime.labels = labels;
				airtime.series = [];
				airtime.series.push(series);
				airtime.anos = anos;
				airtime.high = maxList;

				console.log('airtimeMensal', airtime);
				
				return res.status(200).end(JSON.stringify({ airtimeMensal: airtime, airtimes: result }));
			});
	} catch (e) {
		return res.status(500).end(JSON.stringify({ message: 'findByDataInclusaoBetween', error: e }));
	}
})	

module.exports = router;