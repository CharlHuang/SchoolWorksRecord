
export function generator(ASTtree) {
    
    // 未对origin、scale、rot赋值的话，默认使用以下
    var origin = {x:0, y:0};
    var scale = {x:1, y:1};
    var Rot = 0;
    //for的参数
    var for_p = {
        from : 0,
        to : 0,
        step : 0,
        param : null,
        T : null
    }

    //返回的打点
    var ret_points = [];
    
    ASTtree.body.forEach(element => {
        if(typeof(element) === 'undefined') return;
        switch (element.name) {
            case 'ORIGIN':
                origin = {x:getValue(element.expr[0]), y:getValue(element.expr[1])};
                console.log('orgin: '+ origin);
                break;
            case 'ROT':
                Rot = getValue(element.expr[0]);
                console.log('rot: '+ Rot);
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
                for_p.from = getValue(element.para[0]);
                for_p.to = getValue(element.para[1]);
                for_p.step = getValue(element.para[2]);
                //console.log(for_p);

                //get points
                for(for_p.T=for_p.from; for_p.T<=for_p.to; for_p.T+=for_p.step){
                    //重新计算打点坐标值
                    for_p.param = {x:getValue(element.para[3]), y:getValue(element.para[4])};
                    //计算变换值后，压入返回数组
                    ret_points.push(calcPoint(for_p.param.x, for_p.param.y));
                }
                break;
            default:
                throw new TypeError("语义错误");
        }
    });
    //返回所有语句的打点坐标数组
    return ret_points;

    function getValue(node){
        if(typeof(node) === 'number'){
            return node;
        }
        if(typeof(node) === 'string'){
            return for_p.T;
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
        var temp = _x*Math.cos(Rot) + _y*Math.sin(Rot);
        _y = _y*Math.cos(Rot) - _x*Math.sin(Rot);
        _x = temp;
        //平移
        _x += origin.x;
        _y += origin.y;
        //console.log('('+_x+','+_y+')');
        return [_x, _y];
    }
}