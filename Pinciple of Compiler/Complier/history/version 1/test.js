import {lexer} from './Lexer.js'
import {parser} from "./parser.js";
import {Generator as draw} from "./draw.js";

//const util = require('util');
const stmt = [
    "origin is (20,30);	--设置原点的偏移量\n"+
    "rot is pi/6;		--设置旋转角度\n"+
    "scale is (2,1);		--设置横坐标和纵坐标的比例\n"+
    "for T from 0 to 200 step 1 draw (t, 0);  --横坐标的轨迹\n"+
    "for T from 0 to 180 step 1 draw (0, -t); --纵坐标的轨迹\n"+
    "for T from 0 to 150 step 1 draw (t, -t); --f(t)=t的轨迹"
];

stmt.forEach( element => {
    var lexer_res = lexer(element);
    //console.log(lexer_res);
    var parser_res = parser(lexer_res);
    //console.log(util.inspect(parser_res,{showHidden:false, depth:null}));
    draw(parser_res);
});

var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var cntx = canvas.getContext('2d');
        cntx.strokeStyle = "black";
        cntx.stroke(20,30, 1, 1);
    }else alert("该浏览器不支持canvas");
    
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