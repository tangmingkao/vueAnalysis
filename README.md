### VUE 源码分析

#### 流程

_init  (合并属性 -> 调用生命周期函数beforeCreate -> 初始化状态（包含属性，计算属性，watch，data等）)

initData （初始化数据 观测数据 生成依赖收集dep实例）

$mount (页面挂载) -> mountComponent

mountComponent  调用生命周期函数beforeMount -> 生成一个watcher实例 

生成watcher实例的时候首先会进行一次渲染 触发 pushTarget方法 将watcher放到Dep类的target属性上 -> 调用 vm._update(vm._render())方法进行页面首次渲染 -> 触发data的数据观测的get 进行依赖收集 dep.depend()方法 -> 在Dep.target存的watcher实例的addDep方法(利用set数据结构唯一性进行去重)在watcher实例的deps属性上存关联dep实例 -> 触发dep.addSub方法将watcher存入dep中this.subs数组中 -> popTarget 将 Dep.target属性置为null。

当下次data数据变化类。会触发 dep.notify()方法。 -> 循环dep实例的subs数组。触发数组中watcher的update方法。-> getter方法 -> vm._update(vm._render())方法
