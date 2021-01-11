import {lexer} from './Lexer.mjs'
import {parser} from "./parser.mjs";
import {generator} from "./generator.mjs";
import {} from "./node_modules/d3/dist/d3.js"

//const util = require('util');
const TESTprogram = "origin is (500,500);	//设置原点的偏移量\n"+
"rot is PI/3;		--设置顺时针旋转角度\n"+
"scale is (5,5);		--设置横坐标和纵坐标的比例\n"+
"for T from -100 to 100 step 0.2 draw (t,10*log(0.2*t));\n"+
"for T from -100 to 100 step 0.2 draw (-10*log(0.2*t),t);\n"+
"for T from -100 to 100 step 0.2 draw (t,-10*log(0.2*-t));\n"+
"for T from -100 to 100 step 0.2 draw (10*log(0.2*-t),t);\n"+
"for T from 0 to 100 step 0.5 draw (10*cos(t), 20*sin(t));  --圆\n"+
"for T from 0 to 100 step 0.5 draw (20*cos(t), 10*sin(t)); --圆"

//初始化svg画布
var width = 1500;
var height = 1000;
var svg = d3.select("body")
            .append("svg")
            .attr("width",width)
            .attr("height",height);

var DrawProgram = function(program){
    var lexer_res = lexer(program);
    //console.log(lexer_res);
    var parser_res = parser(lexer_res);
    //console.log(util.inspect(parser_res,{showHidden:false, depth:null}));
    var points = generator(parser_res);
    console.log(points);

    var circles = svg.selectAll("circle")
                     .data(points)
                     .enter()
                     .append("circle");

    circles.attr("cx", function(d,i){
        return d[0];
    }).attr("cy",function (d,i) {
        return height - d[1];
    }).attr("r",function (d) {
        return 2;
    }).attr("fill", "green");
}

var inputbox = document.getElementById('inputText');
var button = document.getElementById('SUBMIT');
inputbox.value = TESTprogram;

button.onclick=function(){
    d3.selectAll("circle").remove();
    DrawProgram(inputbox.value);
};

/*
const ERRstmt = [

]
ERRstmt.forEach( element => {
    var lexer_res = LEXER.lexer(element);
    //console.log(lexer_res);
    var parser_res = PARSER.parser(lexer_res);
    console.log(util.inspect(parser_res,{showHidden:false, depth:null}));
});
*/
//console.log(eval('Math.sin(20)'));
/*
var str ={x:'a',y:'b'};
console.log(str)
function a(str){
    str.x ='x';
    str.y = 'y';
    return str;
}
a(str);
console.log(str)*/