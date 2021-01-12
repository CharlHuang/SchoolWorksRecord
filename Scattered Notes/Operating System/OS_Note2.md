# OS STRUCTURE ---Introduction
## System Calls

## Monolithic Sys 单体结构

## Layered Sys 分层系统
- 分层次，避免混乱。
- 核心功能放在内核

## Microkernels 微内核结构
- MINIX（微内核、分层特点）
- 保护、安全重要性有分级别。
- 驱动driver -> 服务server -> 用户程序user

## Client-Server Model (CS)

## Virtual Machines 虚拟机
- 一虚多、多虚一、多虚多：
一个机器虚拟给多个用户，多个机器虚拟给一个用户，多个机器虚拟给多个用户（如阿里云）

# Processes and Threads
- ## Processes 进程
    - 进程，即正在进行的程序。
    - 每个进程都有自己的程序计数器(program counter)、栈(stack)、数据部分(data section)
    >以上为核心内容，包括但不仅限于。
    - 单核的*multiprograming*，各个程序进行调度穿插进行。宏观上是并行，微观上还是串行。
    - **Process creation 进程创建**
        - System initialization （系统初始化）
        - Execution of a process creation system （系统调用）
        - User request to create a new process（用户命令）
        - Initiation of a batch job（批处理作业的初始化）
        - 父进程创造子进程，父子进程间相互嵌套形成进程树
        - 父子进程间的资源共享情况：
            - 子进程获得父进程的资源子集
            - 全共享
            - 无共享
        - 父子进程同时执行，父进程会在子进程终止前等待

    - **Process Terminal进程终止**
        - normal exit (voluntory)
        - Error exit (voluntary)
        - Fatal exit (involuntory) **严重错误**
        - 主要分为资源性终止和非资源性终止。
        - **父进程**有终止(kill)子进程的权利，**优先级高**的进程可以杀死优先级低的，**形成死锁**后会终止掉相应的进程。
        - **子进程由父进程控制**。父进程终止，子进程都终止(级联终止)，避免子进程游离静止。
    - **Process State 进程状态**
        - new 正在创造
        - running 正在运行
        - waiting(blocked) 等待某事件发生
        - ready 就绪/排队
        - terminated 终止
        ![error](imgs\processState.png)
        > 只能从ready到达running
    - **When to Switch a process 切换进程时间点**
        - clock interrupt: 被分配的时间结束
        - I/O interrupt
        - Memory fault
        - Trap(陷入) ：出现错误，或许致使进程退出
        - Supervisor call 管理程序调用
    - **CPU Switch**
        - ![error](imgs\CPUswitch.png)
    - **Context Switch 上下文切换**
        - 核心内容包括CPU寄存器状态，进程状态，存储管理相关信息。
        - 切换是CPU的额外负担(无用功)，必要，但不宜频繁。
    - **Process Scheduling Queues 进程调度队列**
        - 安排进程时间，下一个该谁，等等。
        - Job queue 作业队列
        - Ready queue 就绪队列
        - Device queue 设备队列（eg.多个使用打印机）
        > 进程的一生就是在不断的排不同的队，然后执行
    - **Implementation of Processes**
        - PCB process control block，又称进程表process table
        ![error](imgs\ProcessTable.png)

- ## Threads 线程
    - 轻量级进程、**CPU分配的基本单元**。
    - 含有
        - program counter 程序计数器
        - register set
        - stack space
    - 多线程任务在多核运行时，效率大大提高，但多线程任务在单核系统中运行反而会提高CPU的切换成本，拖慢速度。
    - **Implementing Threads in Processes**
        - 线程表由进程自行维护，内核负责维护进程表，而不干预里进程内部的进程表：
            - 操作系统不需要支持多线程，靠用户管理，减少内核负担
            - 进程只能看见自己的多线程，而不能干预其他进程的线程
            - 允许用户自定义调度算法
    - **Implementing Threads in the Kernels**
        - 多线程管理由内核承担，所有线程由OS记录、管理
            - 用户无需自定义线程调度
            - 可以访问到其他进程的线程
            - 调度算法由内核统一，弹性较差
    - **Hybrid Implementaions**
        - 混合上述两种，有自定义用自定义，没有用系统自带。
    - 
- ## Scheduling 调度
    - Scheduler: a chioce has to be made which process to run next.
    - 目的是提高CPU效率。
    - 总体目标：每个进程都能用得到、都能完成功能，同时又要保证操作系统本身的安全和正常运行。
    - I/O密集型进程*bound proccess* --- CPU密集型进程（主要考虑CPU/高速设备）
    - Schediling Algorithm Goals
    - 对于所有的系统
        - 公平
        - 策略强制执行
        - 
    - **Batch System**
        - First-come first-served(FCFS)， 效率较低
            - 产生护送效应（长的先到拖慢短的进程的周转时间）
        - Shortest job first scheduling 最短作业优先 
            - 平均完成时长比FCFS更短
        - Three level scheduling
    - **Interactive System 交互系统**
        - *Round Robin Scheduling* 轮转算法
            - 所有进程各用一段时间，再到后面排队。
            - 每个进程有自己的时间片(*quantum*，不可再分的时间单元)，结束后进程间进行调度。*quantum*不宜过大或过小。太大在一个片内会运行多个进程；太小调度过于频繁，提高切换成本拖慢速度。
            ![error](imgs\quantum.png)
            - 响应时间比最短作业更好
        - *Priority Scheduling* 优先级调度
            - 涵盖了前面几种算法，综合考虑各类因素。

            - 优先级分为动态*dynamically* 或静态的*statically* 。   
            > ep. 动态例子：等待时长过长的进程会提高其优先级、霸占资源过久的进程降低其优先级。如通过Aging algorithmn解决starvation（优先级低的进程永远无法被执行）问题。
        - *Shortest Process Next* 下一最短进程优先
            - Make estimates based on past behavior 用公式推算进程的资源需要 
            $\alpha T_0+(1-\alpha)T_1   ——T为周期$
            >eg. 某一进程用了大量资源，那后面可能还会用这么多的资源；某一进程不怎么用CPU，那后面可能不怎么会用资源
        - *Guaranteed Scheduling*
        - *Lottery Scheduling*  “乐透”调度
            - 公平性
            - 随机派发运行时间彩票。
            >看上去很随意，但挺好用的
        - *Fair-share Scheduling*
            - **根据用户**均分时间
            >eg. 两个用户，各用总时50%
    - *Real-Time System* 实时系统
    - *Thread Scheduling* 
        - 内核看得见就能调度，看不见就无法调度（用户级别线程内核无法调度）
    - **CPU Scheduler**
        - 对进程进行调度
        - CPU调度通常出现在进程：
            - 1.running -> waiting
            - 2.running -> ready
            - 3.waiting -> ready
            - 4.Terminal
            - 1和4为*nonpreemptive* 非抢占式调度，其他为*preemptive* 抢占式调度
        - *Scheduling Criteria* 调度标准
            - CPU利用率
            - m
    - Multilevel Feedback Queue 多级反馈队列
        - 传统UNIX反馈调度机制
- ## Interprocess communication 进程间通信/IPC
    - Race Condition 进程间竞争资源
        - Four conditions to provide mutual exclusion 互斥:
        1. No two processes simultaneously in critical region
        2. No assumptions made about speeds or numbers of CPUs
        3. No process running outside its critical region may block another process
        4. No process must wait forever to enter its critical region
    - Critical region 临界区
        - 即被多个程序共享的数据段
    - busy waiting 忙等待，占用cpu（判断是否能够进入）
        - Disable Interrupts 禁止中断
        - Lock Variables 锁变量
            - 实现简单，容易出错产生死锁
        - Strict Alternation 严格轮换法
            - turn变量1/0，控制两进程轮换使用。在未到该进程使用时一直等待。
            - 容易造成优先级颠倒的状况
        - Peterson’s Solution Peterson解法
        - The TSL Instruction TSL指令
    - Sleep and Wakeup 
    - **Semaphore** 信号量
        - 不产生忙等待
        - PV操作，P为减*down*，V为加*up*
        - 不同的信号量版本，工作方式不一样，比如POSIX可以小于零

>本篇几个代码需要好好理解

- ## Classical IPC problems 经典IPC问题