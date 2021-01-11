import {scaleLiner} from "d3-scale"

function Generator(ASTtree) {
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var cntx = canvas.getContext('2d');
        cntx.strokeStyle = "black";
        cntx.strokeRect(0,0,1000,600);
    }else alert("该浏览器不支持canvas");
    
    // 未对origin、scale、rot复制的话，默认使用以下
    var origin = {x:0, y:0};
    var scale = {x:1, y:1};
    var rot = 0;
    var from, to, step, param;
    var T;
    
    ASTtree.body.forEach(element => {
        if(typeof(element) === 'undefined') return;
        switch (element.name) {
            case 'ORIGIN':
                origin = {x:getValue(element.expr[0]), y:getValue(element.expr[1])};
                console.log('orgin: '+ origin);
                break;
            case 'ROT':
                rot = getValue(element.expr[0]);
                console.log('rot: '+ rot);
                break;
            case 'SCALE':
                scale = {x:getValue(element.expr[0]), y:getValue(element.expr[1])};
                console.log('scale: '+ scale);
                break;
            case 'FOR':
                //语法语义分析融合
                for(var i=0; i<3; i++){
                    if(element.para[i] === 'T'){
                        throw new TypeError('For 循环中不能包含 T');
                    }
                }
                //access values
                from = getValue(element.para[0]);
                to = getValue(element.para[1]);
                step = getValue(element.para[2]);
                param = {x:getValue(element.para[3]), y:getValue(element.para[4])};
                console.log('from: '+from+' to: '+to+' step: '+step+' param: '+param.x+','+param.y);
                //draw 
                for(var T=from; T<=to; T+=step){
                    var pos = TtoValue(param, T);
                    Draw(calcPoint(pos.x, pos.y));
                }
                break;
            default:
                throw new TypeError("语义错误");
        }
    });
    function getValue(node){
        if(typeof(node) === 'number'){
            return node;
        }
        if(typeof(node) === 'string'){
            return T;
        }
        if (typeof(node) === 'object'){
            switch (node.type) {
                case 'EXPRESSION':
                case 'TERM':
                    return eval("getValue(node.lvalue)"+node.op+ "getValue(node.rvalue);")
                case 'FACTOR':
                    return node.lvalue - getValue(node.rvalue);
                case 'COMPONENT':
                    return Math.pow(getValue(node.lvalue), getValue(node.rvalue));
                case 'FUNC':
                    return eval("Math."+node.op.toLowerCase()+"(getValue(node.expr));")
                default:
                    break;
            }
        }
        throw new TypeError('无法识别对象');
    }
    function calcPoint(_x, _y){
        //缩放
        _x *= scale.x;
        _y *= scale.y;
        //旋转
        var temp = _x*Math.cos(rot) + _y*Math.sin(rot);
        _y = _y*Math.cos(rot) - _x*Math.sin(rot);
        _x = temp;
        //平移
        _x += origin.x;
        _y += origin.y;
        console.log('('+_x+','+_y+')');
        return {x:_x, y:_y}
    }
}
var stmt = [
    "origin is (200,300);	--设置原点的偏移量\n"+
    "rot is pi/6;		--设置旋转角度\n"+
    "scale is (2,1);		--设置横坐标和纵坐标的比例\n"+
    "for T from 0 to 200 step 1 draw (t, 0);  --横坐标的轨迹\n"
]
const util = require('util');
var LEXER = require('./Lexer');
var PARSER = require('./Parser');

stmt.forEach( element => {
    var lexer_res = LEXER.lexer(element);
    //console.log(lexer_res);
    var parser_res = PARSER.parser(lexer_res);
    console.log(util.inspect(parser_res,{showHidden:false, depth:null}));
    var gen_res = Generator(parser_res);
});
