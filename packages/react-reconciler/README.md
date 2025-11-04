# reconciler的工作方式

对于同一个节点，比较其React Element与fiberNode, 生成子fiberNode。并根据比较的结果生成不同标记(插入、删除、移动...)，对应不同宿主环境API的执行

![alt text](image.png)

# 接入状态更新机制

![alt text](image-1.png)
