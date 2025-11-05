import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	// 将workInProgress指向第一个需要遍历的fiberNode
	workInProgress = createWorkInProgress(root.current, {});
}

/**
 * 将updateContainer与renderRoot更新流程连接上
 * 首屏渲染时，传进来的fiber是hostRootFiber
 * this.setState, 传进来的fiber是class component对应的fiber
 *
 * @export
 * @param {FiberNode} fiber
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 调度功能
	// 从当前触发更新的fiber，一直向上遍历到fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;

	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

/**
 * 触发更新的api会调用此方法
 * 常见的触发更新的方式
 * ReactDom.createRoot().render(或者老版的ReactDom.render)
 * this.setState
 * useState的dispatch方法
 *
 * @param {FiberNode} root
 */
function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	// 执行递归流程
	do {
		try {
			workLoop(); // 执行 Fiber 单元任务
			break; // 没出错：停止 do-while
		} catch (e) {
			// workLoop 出错
			console.warn('workLoop发生错误', e);

			// 不 break，继续下一次循环
			workInProgress = null;
			// workInProgress 通常会指向一个新的 Fiber 节点（可恢复点）
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// wip fiberNode树构建完成，准备提交
	commitRoot(root);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	// 如果有子节点，遍历子节点
	// next可能是fiber节点的子fiber或者null
	// 如果是子fiber，继续遍历
	// 如果是null,说明没有子fiber

	// 更新流程的目的：
	// 1. 生成wip fiberNode树
	// 2. 标记副作用flags
	// 更新流程的步骤
	// 1. 递：beginWork
	// 2. 归：completeWork
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 开始归阶段
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	// 如果没有子节点，遍历兄弟节点
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const sibling = node.sibling;

		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
