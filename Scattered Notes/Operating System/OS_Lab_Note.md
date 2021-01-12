>```
>fpid=fork(); 
>   if (fpid < 0)...
>```
>- 在语句fpid=fork()之前，只有一个进程在执行这段代码，但在这条语句之后，就变成两个进程在执行了。
>- 这两个进程的几乎完全相同，**将要执行的下一条语句都是if(fpid<0)……**
>- 这两个进程执行没有固定的先后顺序，哪个进程先执行要看系统的进程调度策略。

>在编译中要加 -lpthread参数（最好加在最后面）
    `gcc thread.c -o thread -lpthread`
    thread.c为你些的源文件，不要忘了加上头文件`#include<pthread.h>`
因为pthread 库不是 Linux 系统默认的库，连接时需要使用静态库 libpthread.a