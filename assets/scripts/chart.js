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
        window.addEventListener('resize', this.resizeChart.bind(this));
        createjs.Ticker.addEventListener("tick", this.stage);
    };
    piechart.constructor = piechart;
    piechart.prototype.resizeChart = function () {
        this.domStyle = window.getComputedStyle(this.domelement);
        this.container.removeAllChildren();
        if (this.orgRadius && this.percentage) {
            this.create(this.orgRadius, this.percentage);
        }
    };
    piechart.prototype.create = function (radius, percentage) {
        var domWidth = parseInt(this.domStyle.width);
        radius = domWidth ? ((domWidth / 2) - 20) : 100;
        this.orgRadius = radius;
        this.percentage = percentage;
        percentage = percentage ? percentage * 0.9 : 0;

        var chartWidth = (this.config.chart) ? ((this.config.chart.width) ? this.config.chart.width : 10) : 10;
        this.container.y = chartWidth / 4;
        this.container.x = chartWidth / 4;
        radius = (domWidth > (radius * 2)) ? radius : ((radius - (chartWidth * 2)) * (domWidth / (radius * 2)));

        this.canvas.width = domWidth;
        this.canvas.height = domWidth;

        var bgwidth = (this.config.background) ? ((this.config.background.width) ? this.config.background.width : 10) : 10;
        var bgcolor = (this.config.background) ? ((this.config.background.color) ? this.config.background.color : '#ff0000') : '#ff0000';

        var bgshape = new createjs.Shape();
        var pos = radius + bgwidth;
        var g = bgshape.graphics;
        var e1 = (Math.PI * 2) * ((90 / 100) - 0.25);
        g.setStrokeStyle(bgwidth);
        g.beginStroke(bgcolor);
        g.arc(pos, pos, radius - chartWidth / 2, -Math.PI / 2, e1);
        this.container.addChild(bgshape);
        this.container.rotation = 195;
        this.container.x = (domWidth / 2);
        this.container.y = domWidth / 2;
        this.container.regX = domWidth / 2;
        this.container.regY = domWidth / 2;
        this.stage.update();
        //

        //this.container.addChild(shape);
        var startAngle = -Math.PI / 2;
        var endAngle = percentage > 25 ? (Math.PI * 2) * ((percentage / 100) - 0.25) : ((-Math.PI / 2) * ((25 - percentage) / 25));


        var shadowWidth = (this.config.shadow) ? ((this.config.shadow.width) ? this.config.shadow.width : chartWidth) : chartWidth;
        var shadowColor = (this.config.shadow) ? ((this.config.shadow.color) ? this.config.shadow.color : '#000000') : '#000000';

        var shadow = new createjs.Shape();
        shadow.graphics.s(shadowColor).ss(shadowWidth);
        this.container.addChild(shadow);
        var shadowCommand = shadow.graphics.arc(pos, pos, radius - chartWidth / 2, startAngle, startAngle).command;
        shadow.setBounds(0, 0, radius * 2, radius * 2);

        var font = (this.config.text) ? ((this.config.text.font) ? this.config.shadow.font : "20px Arial") : "20px Arial";
        var text = new createjs.Text(percentage + (percentage * 0.1), font, "#989899");
        this.container.addChild(text);

        var bounds = this.container.getBounds();
        text.x = bounds.width / 2 + (text.getMeasuredWidth() / 2);
        text.textAlign = 'center';
        text.y = bounds.height / 2;
        text.rotation = 167;
        createjs.Tween.get(shadowCommand).to({
            endAngle: endAngle
        }, 1000).call(handleComplete.bind(this)).addEventListener("change", handleChange);
        var done = false;

        function handleChange() {
            if (!done) {
                text.text = Math.ceil(Math.random() * 90);
                text.regX = -text.getMeasuredWidth() / 2;
                text.regY = text.getMeasuredHeight() / 2;
            }
        }

        function handleComplete() {
            done = true;
            text.text = this.percentage + "%";
            text.regX = -text.getMeasuredWidth() / 2;
            text.regY = -text.getMeasuredHeight() / 2;
        }

    };
    chart.piechart = piechart;
}());