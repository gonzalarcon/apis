const urlApi = 'https://mindicador.cl/api';
const filtrarMonedas = ["dolar", "euro", "uf", "utm"];
const selectWithCurrencies = document.querySelector("#moneda");
const divResult = document.querySelector("#result");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const calcResult = (amount) => `$${(amount/selectWithCurrencies.value).toFixed(2)}`;

// obteniendo monedas desde la API
const getCurrencies = async () =>{
    try{
        const reqCurrencies = await fetch(urlApi);
        const resData = await reqCurrencies.json();

        // obteniendo el código de las divisas
        const currencyList = filtrarMonedas.map((currency)=>{
            return{
                code: resData[currency].codigo,
                value: resData[currency].valor,
            }
        } )

        //mostrando monedas
        currencyList.forEach((localCurrency)=> {
            const selectOption = document.createElement("option");
            selectOption.value = localCurrency.value;
            selectOption.text = capitalize(localCurrency.code);
            selectWithCurrencies.appendChild(selectOption);
    })    
    } catch(error){
        console.log(error);
        alert('Error al obtener el listado de monedas')
    }

}
 
//gráfico
const drawChart = async () => {
    try {
        const currency =
        selectWithCurrencies.options[
            selectWithCurrencies.selectedIndex
        ].text.toLowerCase();


        const reqChart = await fetch(`${urlApi}/${currency}`);
        const dataChart = await reqChart.json();

        const serietoChart = dataChart.serie.slice(0, 10).reverse();

        const data = {
            labels: serietoChart.map((item)=> item.fecha.substring(0, 10)),
            datasets: [
                {
                    label: currency,
                    data: serietoChart.map((item) =>item.valor),
                },
            ],
        };
        const config = {
            type: 'line',
            data: data,
        };

        const chartDom = document.querySelector("#chart");
        chartDom.classList.remove("d-none");
        new Chart(chartDom, config);

    } catch (error){
        alert('Hubo un problema al obtener los datos para generar el gráfico. Refresca la página e inténtalo de nuevo');
        console.log(error);
    }

}

document.querySelector("#btnConvert").addEventListener('click', ()=>{
    const amountPesos = document.querySelector('#pesos').value;
    if(amountPesos == ''){
        alert('Debes ingresar un valor');
        return;
    }
    divResult.innerHTML=calcResult(amountPesos);
    drawChart();
});

getCurrencies();