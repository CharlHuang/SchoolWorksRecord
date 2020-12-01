/*  分析
 * 
 * 
 */
#include <cmath>
#include <vector>
#include <iostream>
using namespace std;

class TUPLE{
    public:
        double x1;
        double x2;
        TUPLE():x1(0), x2(0){}
        TUPLE(double xx1, double xx2):x1(xx1), x2(xx2){}
        TUPLE operator+(const TUPLE t){
            return {t.x1+this->x1, t.x2+this->x2};
        }
        TUPLE operator-(const TUPLE t){
            return {this->x1-t.x1, this->x2-t.x2};
        }
        TUPLE operator+(const double t){
            return {t+this->x1, t+this->x2};
        }
        TUPLE operator-(const double t){
            return {this->x1-t, this->x2-t};
        }
        TUPLE operator*(const double t){
            return {this->x1*t, this->x2*t};
        }
        TUPLE operator*(const TUPLE t){
            return {this->x1*t.x1, this->x2*t.x2};
        }
};

double min(double a, double b){
    return a>b?b:a;
}
double max(double a, double b){
    return a>b?a:b;
}

// f(x1,x2) = 4x_1^2 - 2.1x_1^4 + 1/3 x_1^6 - x_1 * x_2 - 4x_2^2 + 4x_2^4
double f(TUPLE const x){
    const double x1 = x.x1;
    const double x2 = x.x2;
    const double res = 4*pow(x1,2) - 2.1*pow(x1,4) + 0.333333*pow(x1,6) - x1* x2 - 4*pow(x2,2) + 4*pow(x2, 4);
    return res;
}

//获取x_k处梯度
TUPLE delta_f(TUPLE const x_k){
    const double x1 = x_k.x1;
    const double x2 = x_k.x2;
    double df1, df2;
    //导数计算
    df1 = 8*x1 - 8.4*pow(x1,3) + 2*pow(x1,5) - x2;
    df2 = 16*pow(x2,3) - 8*x2 - x1;
    return {df1, df2};
}

//检测过程中是否发生越界，并修正，然后返回true，否则返回false
bool Restrict(TUPLE& t){
    if(t.x1 >= 3.0 || t.x1 <= -3.0){
        t.x1 = min(3.0,t.x1);
        t.x1 = max(3.0,t.x1);
    }
    else if (t.x2 >= 3.0 || t.x2 <= -3.0){
        t.x2 = min(3.0,t.x2);
        t.x2 = max(3.0,t.x2);
    }
    else return false;
    return true;
}

double LineSearch(TUPLE x, TUPLE d, double const eps = 0.002){
    //在[0,2]区间一维搜索lamda，使用 618 黄金分割法
    TUPLE tmpl, tmph;
    double r,u,a,b;
    a = 0;
    b = 2;
    r = a + 0.382*(b-a);
    u = a + 0.618*(b-a);
    while(u-r > eps){
        tmpl = x+d*r;
        tmph = x+d*u;
        Restrict(tmpl);
        Restrict(tmph);
        if(f(tmpl) > f(tmph)){
            a = r;
            r = u;
            u = a + 0.618*(b-a);
        }else{
            b = u;
            u = r;
            r = a + 0.382*(b-a);
        }
    }
    if(f(tmpl) > f(tmph))
        return u;
    else 
        return r;
}

//获得每次迭代的x的结果
void iteration(vector<TUPLE>& eve_x, int times){
    int k=0;
    TUPLE x_k, x_kplus;
    TUPLE d_k;
    vector<TUPLE> inv_dd_k;
    double lamda = 0;

    for(; k<times; k++){
        //取x_k
        x_k = eve_x.back();
        //最速方向
        d_k =  delta_f(x_k) * (-1);
        //一维搜索获取lamda
        lamda = LineSearch(x_k, d_k, 0.002);
        //获取x_k+1
        x_kplus = d_k * lamda + x_k;
        //检测是否越界
        Restrict(x_kplus);
        //存储到迭代结果内
        eve_x.push_back(x_kplus);
    }
}

int main(){
    TUPLE x0 = {-2,-1};
    vector<TUPLE> eve_x;
    eve_x.push_back(x0);
    //cout << eve_x[0].x1 << ' ' << eve_x[0].x2 << endl;

    iteration(eve_x, 50);
    cout << "# steep-descent ..." << endl;
    cout << "   Iteration 10: (x1,x2)=(" << eve_x[9].x1<< ',' << eve_x[9].x2 << ')' ;
    cout << "   f(x)=" << f(eve_x[9]) <<endl;
    cout << "   Iteration 50: (x1,x2)=(" << eve_x[49].x1<< ',' << eve_x[49].x2 << ')' ;
    cout << "   f(x)=" << f(eve_x[49]) <<endl;
    
    return 0; 
}
