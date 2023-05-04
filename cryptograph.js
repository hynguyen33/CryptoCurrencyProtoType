
(function () {

    var width = 1000, height = 600
    const BTC = 'btc'
    const LTC = 'ltc'
    const ETH = 'eth'
    const DOGE = 'doge'
    const SHIBA = 'shiba'

    const BTC_COLOR = '#07d2c3'
    const LTC_COLOR = '#9e7be3'
    const ETH_COLOR = '#fb5da5'
    const DOGE_COLOR = '#ff9a34'
    const SHIBA_COLOR = '#6891ff'

    const PRICE = 'price'
    const MARKETCAP = 'marketcap'
    const VOLUME = 'volume'

    var btcSelected = false
    var ltcSelected = false
    var ethSelected = false
    var dogeSelected = false
    var shibaSelected = false

    var chartValueSelected = PRICE

    var isZoomView = false

    var btc
    var ltc
    var doge
    var eth
    var shiba

    $('[data-toggle="tooltip"]').tooltip()

    $('input:radio[name=chartValue]').change(function () {
        chartValueSelected = $("input[name='chartValue']:checked").val()
        console.log('chart selected value: ', chartValueSelected)
        clearCharts()
        drawCharts()
    })

    $('input:checkbox[name=zoomControl]').change(function () {
        isZoomView = $('input:checkbox[name=zoomControl]').is(':checked')
        console.log('is zoom view: ', isZoomView)
        clearCharts()
        drawCharts()
    })

    $('.img-fluid').click(function (e) {
        var item = $(e.target).attr('data-item')
        var selectedColor = selectedcolor(item)
        var isSelected = selectedCoin(item)

        var filter = 'grayscale(0%) drop-shadow(7px 0 0 color) drop-shadow(0 7px 0 color) drop-shadow(-7px 0 0 color) drop-shadow(0 -7px 0 color)'
        var selectedCoinfilter = filter.replaceAll('color', selectedColor)

        if (isSelected) {
            $(e.target).css('filter', selectedCoinfilter)
        }
        else {
            $(e.target).css('filter', 'grayscale(100%) drop-shadow(7px 0 0 gray) drop-shadow(0 7px 0 gray) drop-shadow(-7px 0 0 gray) drop-shadow(0 -7px 0 gray)')

        }
        clearCharts()
        drawCharts()
    })

    function selectedcolor(value) {
        if (value === BTC) {
            color = BTC_COLOR
            return color
        }
        else if (value === LTC) {
            color = LTC_COLOR
            return color
        }
        else if (value === ETH) {
            color = ETH_COLOR
            return color
        }
        else if (value === DOGE) {
            color = DOGE_COLOR
            return color
        }
        else if (value === SHIBA) {
            color = SHIBA_COLOR
            return color
        }
    }


    function selectedCoin(value) {
        if (value === BTC) {
            btcSelected = !btcSelected
            return btcSelected
        }
        else if (value === LTC) {
            ltcSelected = !ltcSelected
            return ltcSelected
        }
        else if (value === ETH) {
            ethSelected = !ethSelected
            return ethSelected
        }
        else if (value === DOGE) {
            dogeSelected = !dogeSelected
            return dogeSelected
        }
        else if (value === SHIBA) {
            shibaSelected = !shibaSelected
            return shibaSelected
        }
    }


    var drawCharts = function () {
        if (btcSelected) {
            drawLineChart(btc, BTC_COLOR)
        }

        if (ltcSelected) {
            drawLineChart(ltc, LTC_COLOR)
        }

        if (dogeSelected) {
            drawLineChart(doge, DOGE_COLOR)
        }

        if (ethSelected) {
            drawLineChart(eth, ETH_COLOR)
        }
        if (shibaSelected) {
            drawLineChart(shiba, SHIBA_COLOR)
        }

    }

    var clearCharts = function () {
        var path = d3.selectAll('path')
        path.remove()
    }


    /**
     * Find price of a coin by date
     *
     * @param {*} data
     * @param initialOutput
     * @param finalOutput
     * @param resultName
     * @returns
     */

        // calculate lose and earn in investing game.
    var getInput = function (data, initialOutput, finalOutput, resultName) {
            document.querySelector('.click').addEventListener('click', (e) => {
                const moneyIn = document.getElementById('investAmount').value
                const startDate = document.getElementById('startDate').value
                var startItem = findPriceByDate(startDate, data)
                var startValue = (startItem.high + startItem.low) / 2
                console.log('start price', startValue)
                var totalCoin = (Math.round((moneyIn / startValue) * 100) / 100).toFixed(2)
                console.log('totalCoin', totalCoin)
                const endDate = document.getElementById('endDate').value
                var endItem = findPriceByDate(endDate, data)
                var moneyOut = (Math.round((((endItem.high + endItem.low) / 2) * totalCoin) * 100) / 100).toFixed(2)
                console.log('end price', moneyOut)
                var result = Number((Math.round((moneyOut - moneyIn) * 100) / 100).toFixed(2))
                console.log('result', result)
                document.getElementById(initialOutput).innerHTML = Number(totalCoin).toLocaleString("en-US").concat(' coin')
                document.getElementById(finalOutput).innerHTML = '$'.concat(Number(moneyOut).toLocaleString("en-US"))
                if (result < 0) {
                    document.getElementById(resultName).innerHTML = '-$'.concat(Math.abs(result).toLocaleString("en-US"))
                    document.getElementById(resultName).style.color = '#E16B75'
                }
                else if (result > 0) {
                    document.getElementById(resultName).innerHTML = '+$'.concat(result.toLocaleString("en-US"))
                    document.getElementById(resultName).style.color = '#58BA43'

                }
                else {
                    document.getElementById(resultName).innerHTML = '$'.concat(result.toString())
                }

            });
        }
    // const inputEl = document.getElementById('investAmount').addEventListener()
    // const inputValue = inputEl.value
    // function loginButtonClick() {
    //     alert(inputValue);
    //     console.log(inputValue)
    // }
    var findPriceByDate = function (para, data) {
        console.log(para)
        var date = d3.timeParse('%Y-%m-%d')(para)
        console.log('date', date)
        var item
        var small = Number.MAX_VALUE
        data.forEach(function (d) {
            if (small > Math.abs(d.timestamp - date)) {
                small = Math.abs(d.timestamp - date)
                item = d
            }
        })
        console.log(item)
        return item
    }

    /**
     * Parse utc date
     */
    var parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ")

    /**
     * Convert data
     *
     * @param {*} data
     * @returns
     */
    var convertData = function (data) {
        data.forEach(function (d) {
            d.close = +d.close
            d.high = +d.high
            d.low = +d.low
            d.marketCap = +d.marketCap
            d.volume = +d.volume
            d.open = +d.open
            d.timestamp = parseDate(d.timestamp)
        })
        return data
    }



    /**
     * Draw line chart
     *
     * @param {*} data
     * @param {*} color
     */
    var drawLineChart = function (data, color) {
        // create mapping for x axis

        // create mapping for y axis

        var datas = []
        if (btcSelected) {
            datas.push(...btc)
        }
        if (ltcSelected) {
            datas.push(...ltc)
        }
        if (ethSelected) {
            datas.push(...eth)
        }
        if (dogeSelected) {
            datas.push(...doge)
        }
        if (shibaSelected) {
            datas.push(...shiba)
        }

        var x = d3.scaleTime()
            .domain(d3.extent(datas, function (d) { return d.timestamp }))
            .range([0, width])

        if (isZoomView) {
            if (chartValueSelected === PRICE) {
                var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) { return d.close; })])
                    .range([height, 0])
            }
            else if (chartValueSelected === MARKETCAP) {
                var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) { return d.marketCap; })])
                    .range([height, 0])
            }
            else if (chartValueSelected === VOLUME) {
                var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) { return d.volume; })])
                    .range([height, 0])
            }

        }
        else {
            if (chartValueSelected === PRICE) {
                var y = d3.scaleLinear()
                    .domain([0, d3.max(datas, function (d) { return d.close; })])
                    .range([height, 0])
            }
            else if (chartValueSelected === MARKETCAP) {
                var y = d3.scaleLinear()
                    .domain([0, d3.max(datas, function (d) { return d.marketCap; })])
                    .range([height, 0])
            }
            else if (chartValueSelected === VOLUME) {
                var y = d3.scaleLinear()
                    .domain([0, d3.max(datas, function (d) { return d.volume; })])
                    .range([height, 0])
            }
        }




        if (chartValueSelected === PRICE) {
            var lineGenerator = d3
                .line()
                .x(function (d, i) {
                    return x(d.timestamp);
                })
                .y(function (d) {
                    return y(d.close);
                });
        }
        else if (chartValueSelected === MARKETCAP) {
            var lineGenerator = d3
                .line()
                .x(function (d, i) {
                    return x(d.timestamp);
                })
                .y(function (d) {
                    return y(d.marketCap);
                });
        }
        else if (chartValueSelected === VOLUME) {
            var lineGenerator = d3
                .line()
                .x(function (d, i) {
                    return x(d.timestamp);
                })
                .y(function (d) {
                    return y(d.volume);
                });
        }

        // create line graph
        const line = lineGenerator(data);
        var svg = d3.select("#graph")
            .append("g")
            .attr("transform", "translate(50, 50)");
        svg
            .append("path")
            .attr("d", line)
            .attr("stroke", color)
            .attr("stroke-width", "1.5px")
            .attr("fill", "none");


        d3.select('#right')
            .attr("transform", "translate(" + (width + 50) + ", 50)")
            .transition()
            .call(d3.axisRight(y));

        if (isZoomView) {
            var zoomY = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0])
            d3.select('#right')
                .transition()
                .call(d3.axisRight(zoomY));
        }

        d3.select("#bottom")
            .attr("transform", "translate(50," + (height + 75) + ")")
            .transition()
            .call(d3.axisBottom(x));


    }


    /**
     * Load data and draw chart
     */
    var loadData = function () {
        Promise.all([
            d3.csv("./BTC_ALL_graph_coinmarketcap.csv"),
            d3.csv("./LTC_ALL_graph_coinmarketcap.csv"),
            d3.csv("./DOGE_ALL_graph_coinmarketcap.csv"),
            d3.csv("./ETH_ALL_graph_coinmarketcap.csv"),
            d3.csv("./SHIB_ALL_graph_coinmarketcap.csv")
        ]).then((data) => {
            btc = convertData(data[0])
            ltc = convertData(data[1])
            doge = convertData(data[2])
            eth = convertData(data[3])
            shiba = convertData(data[4])

            // findPriceByDate(2020,12,12, btc)
            console.log()
            getInput(btc, "bitcoinInitialValue", "bitcoinFinalValue", "bitcoinResult")
            getInput(ltc, "litecoinInitialValue", "litecoinFinalValue", "litecoinResult")
            getInput(eth, "ethcoinInitialValue", "ethcoinFinalValue", "ethcoinResult")
            getInput(doge, "dogecoinInitialValue", "dogecoinFinalValue", "dogecoinResult")
            getInput(shiba, "shibacoinInitialValue", "shibacoinFinalValue", "shibacoinResult")
        })
    }

    // run chart
    console.log('run chart')
    loadData()


})();