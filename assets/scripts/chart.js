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
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.domelement = domelement ? domelement : document.body;
        this.domelement.appendChild(this.canvas);
        this.stage = new createjs.Stage(this.canvas);
        this.container = new createjs.Container();
        this.stage.addChild(this.container);
        this.config = config;
        createjs.Ticker.addEventListener("tick", this.stage);
    };
    piechart.constructor = piechart;
    piechart.prototype.create = function (radius, percentage) {
        radius = radius ? radius : 100;
        percentage = percentage ? percentage : 0;
        console.log("p", percentage);
        this.canvas.width = radius * 2.5;
        this.canvas.height = radius * 2.5;
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

        var chartWidth = (this.config.chart) ? ((this.config.chart.width) ? this.config.chart.width : 10) : 10;
        var chartColor = (this.config.chart) ? ((this.config.chart.color) ? this.config.chart.color : '#ff00ff') : '#ff00ff';


        var shape = new createjs.Shape();
        shape.graphics.s(chartColor).ss(chartWidth);
        this.container.addChild(shape);

        var startAngle = -Math.PI / 2;
        var endAngle = percentage > 25 ? (Math.PI * 2) * ((percentage / 100) - 0.25) : ((-Math.PI / 2) * ((25 - percentage) / 25));
        var chartCommand = shape.graphics.arc(pos, pos, radius, startAngle, startAngle).command;
        shape.setBounds(0, 0, radius * 2, radius * 2);

        var shadowWidth = (this.config.shadow) ? ((this.config.shadow.width) ? this.config.shadow.width : chartWidth) : chartWidth;
        var shadowColor = (this.config.shadow) ? ((this.config.shadow.color) ? this.config.shadow.color : '#000000') : '#000000';

        var shadow = new createjs.Shape();
        shadow.graphics.s(shadowColor).ss(shadowWidth);
        this.container.addChild(shadow);
        var diff = shadowWidth < chartWidth ? shadowWidth - (chartWidth / 2) : shadowWidth / 2 - chartWidth / 2;
        var shadowCommand = shadow.graphics.arc(pos, pos, radius - chartWidth - diff, startAngle, startAngle).command;
        shadow.setBounds(0, 0, radius * 2, radius * 2);

        var text = new createjs.Text(percentage, "20px Arial", "#ff7700");
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
            text.text = percentage;
        }

    };
    chart.piechart = piechart;
}());