'use strict'
//全局变量
const TokenTable =
[
   ['CONST_ID',"PI",3.14159],
   ['CONST_ID',"E",2.71828],
   ['T',"T",0.0],
   ['FUNC',"SIN",0.0],
   ['FUNC',"COS",0.0],
   ['FUNC',"TAN",0.0],
   ['FUNC',"LOG",0.0],
   ['FUNC',"EXP",0.0],
   ['FUNC',"SQRT",0.0],

   ['ORIGIN',"ORIGIN",0.0],
   ['SCALE',"SCALE",0.0],
   ['ROT',"ROT",0.0],
   ['IS',"IS",0.0],
   ['FOR',"FOR",0.0],
   ['FROM',"FROM",0.0],
   ['TO',"TO",0.0],
   ['STEP',"STEP",0.0],
   ['DRAW',"DRAW",0.0]
];
const OPERATORS = ['+','-','*','/'];
const LETTERS = /[a-z]|\_/i;     // 字符正则式，i:不分大小写搜索
const DIGITS = /[0-9]/;       // 数字正则式

// input: 语句数据
export function lexer(input){
    var current_char = 0;
    var tokens = [];
    var token;
    var current_stat;
    var charNow;

    while(current_char < input.length){
        charNow = input[current_char];
        //跳过空白符
        while((charNow === ' ' || charNow === '\n' || charNow === '\t') && current_char < input.length){
            charNow = input[++current_char];
        }
        //跳过注释
        if((charNow === "/" && input[current_char+1] === '/' )||(charNow === "-" && input[current_char+1] === '-')) {
            while(charNow != '\n') {
                charNow = input[current_char++];
                if(current_char >= input.length) return tokens;
            }
            continue;
        }
        //检测到字符
        if(LETTERS.test(charNow)){
            var current_stat = 1;
            var token = "";
            //获取字段 state 1
            while(LETTERS.test(charNow) && current_char < input.length){
                token += charNow;
                charNow = input[++current_char];
            }
            var keyJudge = false;
            token = token.toUpperCase();
            for(let i=0; i<TokenTable.length; i++){
                if(token == TokenTable[i][1]){
                    tokens.push({token_type: TokenTable[i][0], token_value: token});
                    keyJudge = true;
                    break;
                }
            }
            if(keyJudge) continue;
        }
        //检测到数字
        if(DIGITS.test(charNow)){
            var current_stat = 2;
            var token = "";
            //state 2
            while((DIGITS.test(charNow) || charNow ==='.')&& current_stat === 2){
                if(charNow === '.')
                    current_stat = 3;
                token += charNow;
                charNow = input[++current_char];
            }
            //state 3
            while(current_stat === 3 && DIGITS.test(charNow)){
                token += charNow;
                charNow = input[++current_char];
            }
            tokens.push({token_type: "NUMBER", token_value: token});
            continue;
        }
        // 匹配运算符
        if(charNow === OPERATORS.find(ele => ele===charNow)) {
            tokens.push({
                token_type: 'OPERATOR',
                token_value: input[current_char+1] == '*' ? '**' : charNow
            });
            current_char++;
            if(input[current_char] == '*' ) current_char++;
            continue;
        }
        // 匹配 分隔符
        if(charNow === '(') {
            tokens.push({
                token_type: "L_BRACKET",
                token_value: charNow
            });
            current_char++;
            continue;
        }
        if(charNow === ')') {
            tokens.push({
                token_type: "R_BRACKET",
                token_value: charNow
            });
            current_char++;
            continue;
        }
        if(charNow === ',') {
            tokens.push({
                token_type: "COMMA",
                token_value: ","
            });
            current_char++;
            continue;
        }
        if(charNow === ';') {
            tokens.push({
                token_type: "SEMIC",
                token_value: ";"
            });
            current_char++;
            continue;
        }
        throw new TypeError('无效标识符: \''+ charNow +'\'  在位置: '+ current_char);
    }
    return tokens;
}
