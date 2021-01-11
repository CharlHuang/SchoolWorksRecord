const OperatorMap = {
    '/' :'DIV',
    '+' :'PLUS',
    '-' :'MINUS',
    '*' :'MUL'
}
function parser(tokens){
    var current_token = 0;
    var ASTtree = {
        type: 'Program',
        body: []
    }
    //树生成开始
    while(current_token < tokens.length){
        ASTtree.body.push(Statement());
    }
    return ASTtree;
/*
 *  树结构 example
    {
        type: 'Program',
        body: [
            {
            type: 'STATEMENT',name: 'FOR',
            para: [
                0,
                150,
                1,
                'T',
                { type: 'FACTOR', op: 'MINUS', lvalue: 0, rvalue: 'T' }
            ]
            }
        ]
        }
 *
*/
    //匹配token
    function MarchToken(goal){
        if(tokens[current_token].token_type != goal){
            throw new TypeError("语法错误 token_type: "+tokens[current_token].token_type+" token_value: "+tokens[current_token].token_value+" 位置: "+current_token);
        }
        current_token++;
        return true;
    }
    function Component() {
        var lcomp = Atom();
        if(tokens[current_token].token_value === '**'){
            MarchToken(tokens[current_token].token_type);
            var node ={
                type: 'COMPONENT',
                op: '**',
                lvalue: lcomp,
                rvalue: Component()
            }
            return node;
        }
        return lcomp;

    }
    function Atom(){
        var tokenNow = tokens[current_token];
        switch(tokenNow.token_type){
            case 'NUMBER':
                MarchToken(tokenNow.token_type);
                return parseFloat(tokenNow.token_value);
            case 'CONST_ID':
            case 'T':
                MarchToken(tokenNow.token_type);    //先吞掉数字项/常数/参数，用tokenNow维护
                if(tokenNow.token_value === 'PI'){
                    return 3.14159;
                }
                if(tokenNow.token_value === 'E'){
                    return 2.71828;
                }
                return tokenNow.token_value;
            case 'FUNC':
                var func = {
                    type: 'FUNC',
                    op: tokenNow.token_value,
                    expr: ''
                }
                MarchToken('FUNC');
            case 'L_BRACKET':
                MarchToken('L_BRACKET');
                var expr = Expression();
                if(typeof(func) != 'undefined'){
                    func.expr = expr;
                    MarchToken('R_BRACKET');
                    return func;
                }
                MarchToken('R_BRACKET');
                return expr;
        }
        throw new TypeError('语法错误（Atom）：'+tokens[current_token].token_type+" 位置: "+current_token);
    }
    function Factor(){
        if (tokens[current_token].token_value === '+') {
            MarchToken(tokens[current_token].token_type);
            return Factor();
        }
        else if (tokens[current_token].token_value === '-') {
            MarchToken(tokens[current_token].token_type);
            var node ={
                type: 'FACTOR',
                op: '-',
                lvalue: 0,
                rvalue: Factor()
            }
            return node;
        }
        else {
            return Component();
        }
    }
    function Term(){
        var lfact = Factor();
        while(tokens[current_token].token_value === '*' || tokens[current_token].token_value === '/'){
            var node = {
                type: 'TERM',
                op: tokens[current_token].token_value,
                lvalue: lfact,
                rvalue: ''
            }
            MarchToken(tokens[current_token].token_type);
            node.rvalue = Factor();
            lfact = node;
        }
        return lfact;
    }
    function Expression(){
        var lexpr = Term();
        while(tokens[current_token].token_value === '+' || tokens[current_token].token_value === '-'){
            var node = {
                type: 'EXPRESSION',
                op: tokens[current_token].token_value,
                lvalue: lexpr,
                rvalue: ''
            }
            MarchToken(tokens[current_token].token_type);
            node.rvalue = Term();
            lexpr = node;
        }
        return lexpr;
    }
    //statement入口
    function Statement(){
        if(current_token > tokens.length) return ;
        var tokenNow = tokens[current_token];
        
        switch(tokenNow.token_type){
            case 'SEMIC':
                current_token++;
                return ;
            case 'ORIGIN':
            case 'SCALE':
                var node = {
                    type: 'STATEMENT',
                    name: tokenNow.token_type,
                    expr: []
                };
                tokenNow = tokens[++current_token];
                MarchToken('IS');
                MarchToken('L_BRACKET');
                node.expr.push(Expression());
                MarchToken('COMMA')
                node.expr.push(Expression());
                MarchToken('R_BRACKET');
                MarchToken('SEMIC');
                return node;
            case 'ROT':
                var node = {
                    type: 'STATEMENT',
                    name: tokenNow.token_type,
                    expr: []
                };
                ++current_token;
                MarchToken('IS');
                node.expr.push(Expression());
                MarchToken('SEMIC');
                return node;
            case 'FOR':
                var fornode = {
                    type: 'STATEMENT',
                    name: tokenNow.token_type,
                    para: []
                };
                ++current_token;
                MarchToken('T');
                MarchToken('FROM');
                fornode.para.push(Expression());   // Expression
                MarchToken('TO');
                fornode.para.push(Expression());   // Expression
                MarchToken('STEP');
                fornode.para.push(Expression());   // Expression
                MarchToken('DRAW');
                MarchToken('L_BRACKET');
                fornode.para.push(Expression());   // Expression
                MarchToken('COMMA');
                fornode.para.push(Expression());   // Expression
                MarchToken('R_BRACKET');
                MarchToken('SEMIC');
                return fornode;
        }
        throw new TypeError('未知语法错误：');
    }
}

const util = require('util');
const stmt = ["origin is (500,500);	//设置原点的偏移量\n"+
"rot is PI/3;		--设置顺时针旋转角度\n"+
"scale is (5,5);		--设置横坐标和纵坐标的比例\n"+
"for T from -100 to 100 step 0.2 draw (t,10*log(0.2*t));\n"+
"for T from -100 to 100 step 0.2 draw (-10*log(0.2*t),t);\n"+
"for T from -100 to 100 step 0.2 draw (t,-10*log(0.2*-t));\n"+
"for T from -100 to 100 step 0.2 draw (10*log(0.2*-t),t);\n"+
"for T from 0 to 100 step 0.5 draw (10*cos(t), 20*sin(t));  --圆\n"+
"for T from 0 to 100 step 0.5 draw (20*cos(t), 10*sin(t)); --圆"]
var LEXER = require('./Lexer');

stmt.forEach( element => {
    var lexer_res = LEXER.lexer(element);
    //console.log(lexer_res);
    var parser_res = parser(lexer_res);
    console.log(util.inspect(parser_res,{showHidden:false, depth:null}));
});
module.exports={
    parser:parser
}