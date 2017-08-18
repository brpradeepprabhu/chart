/*jslint
 this,
 browser
 */
/*global window*/
var createjs = window.createjs || {};
/*global chart*/
var chart = window.chart || {};
(function () {
    "use strict";
    var piechart = function (domelement, config) {
        this.canvas = document.createElement('canvas');
        this.domelement = domelement ? domelement : document.body;
        this.domelement.appendChild(this.canvas);

        this.stage = new createjs.Stage(this.canvas);
        this.container = new createjs.Container();
        this.stage.addChild(this.container);
        this.config = config;
        this.domStyle = window.getComputedStyle(this.domelement);
        window.addEventListener('resize', this.resizeChart.bind(this))
        createjs.Ticker.addEventListener("tick", this.stage);
    };
    piechart.constructor = piechart;
    piechart.prototype.resizeChart = function () {
        this.domStyle = window.getComputedStyle(this.domelement);
        this.container.removeAllChildren();
        if (this.orgRadius && this.percentage) {
            this.create(this.orgRadius, this.percentage);
        }
    }
    piechart.prototype.create = function (radius, percentage) {
        radius = radius ? radius : 100;
        this.orgRadius = radius;
        this.percentage = percentage;
        percentage = percentage ? percentage : 0;
        var domWidth = parseInt(this.domStyle.width)

        var chartWidth = (this.config.chart) ? ((this.config.chart.width) ? this.config.chart.width : 10) : 10;
        var chartColor = (this.config.chart) ? ((this.config.chart.color) ? this.config.chart.color : '#ff00ff') : '#ff00ff';
        this.container.y = chartWidth / 4;
        this.container.x = chartWidth / 4;
        radius = (domWidth > (radius * 2)) ? radius : ((radius - (chartWidth * 2)) * (domWidth / (radius * 2)));
        this.canvas.width = (domWidth > ((radius + chartWidth) * 2.5)) ? (radius + chartWidth) * 2.5 : domWidth;
        this.canvas.height = (domWidth > ((radius + chartWidth) * 2.5)) ? (radius + chartWidth) * 2.5 : domWidth;
        console.log(domWidth, radius, (domWidth > (radius * 2)) ? radius * 2.5 : domWidth)
        // this.canvas.style.left = (this.orgRadius === radius) ? (domWidth - this.canvas.width) / 2 + "px" : 0;
        // this.canvas.style.position = "absolute";

        var bgwidth = (this.config.background) ? ((this.config.background.width) ? this.config.background.width : 10) : 10;
        var bgcolor = (this.config.background) ? ((this.config.background.color) ? this.config.background.color : '#ff0000') : '#ff0000';

        var bgshape = new createjs.Shape();
        var pos = radius + bgwidth;
        var g = bgshape.graphics;
        g.setStrokeStyle(bgwidth);
        g.beginStroke(bgcolor);
        g.drawCircle(pos, pos, radius);
        this.container.addChild(bgshape);
        this.stage.update();

        var shape = new createjs.Shape();
        shape.graphics.s(chartColor).ss(chartWidth);
        this.container.addChild(shape);
        var startAngle = -Math.PI / 2;
        var endAngle = percentage > 25 ? (Math.PI * 2) * ((percentage / 100) - 0.25) : ((-Math.PI / 2) * ((25 - percentage) / 25));
        var chartCommand = shape.graphics.arc(pos, pos, radius + bgwidth / 2, startAngle, startAngle).command;
        shape.setBounds(0, 0, radius * 2, radius * 2);

        var shadowWidth = (this.config.shadow) ? ((this.config.shadow.width) ? this.config.shadow.width : chartWidth) : chartWidth;
        var shadowColor = (this.config.shadow) ? ((this.config.shadow.color) ? this.config.shadow.color : '#000000') : '#000000';

        var shadow = new createjs.Shape();
        shadow.graphics.s(shadowColor).ss(shadowWidth);
        this.container.addChild(shadow);
        var diff = shadowWidth < chartWidth ? shadowWidth - (chartWidth / 2) : shadowWidth / 2 - chartWidth / 2;
        var shadowCommand = shadow.graphics.arc(pos, pos, radius - chartWidth / 2 - diff / 2, startAngle, startAngle).command;
        shadow.setBounds(0, 0, radius * 2, radius * 2);

        var font = (this.config.text) ? ((this.config.text.font) ? this.config.shadow.font : "20px Arial") : "20px Arial";
        var shadowColor = (this.config.shadow) ? ((this.config.shadow.color) ? this.config.shadow.color : '#000000') : '#000000';
        var text = new createjs.Text(percentage, font, "#ff7700");
        this.container.addChild(text);
        var bounds = this.container.getBounds();
        text.x = bounds.width / 2 + (text.getMeasuredWidth() / 2);
        text.textAlign = 'center';
        text.y = bounds.height / 2;
        createjs.Tween.get(chartCommand).to({
            endAngle: endAngle
        }, 1000);
        var tween = createjs.Tween.get(shadowCommand).to({
            endAngle: endAngle
        }, 1000).call(handleComplete).addEventListener("change", handleChange);
        var done = false;

        function handleChange() {
            if (!done) {
                text.text = Math.ceil(Math.random() * 100);
            }
        }

        function handleComplete() {
            done = true;
            text.text = percentage + "%";
        }

    };
    chart.piechart = piechart;
}());