import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
	// 1. 通过比对子的ReactElement与子current fiberNode 生成子fiberNode
	// 2. 标记与结构变化相关的flags
	switch (wip.tag) {
		case HostRoot:
			// 1. 计算状态的最新值
			// 2. 创建子fiberNode
			return updateHostRoot(wip);
		case HostComponent:
			// 1. 创建子fiberNode, hostCompnent中无法触发更新
			return updateHostComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
};

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	// 对于hostRootFiber来说，update为element,
	wip.memoizedState = memoizedState;

	// 通过比对子ReactElement与子fiberNode，生成子wip fiber
	const nextChildren = wip.memoizedState;

	//
	reconcilerChildren(wip, nextChildren);

	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;

	//
	reconcilerChildren(wip, nextChildren);

	return wip.child;
}

function reconcilerChildren(wip: FiberNode, children?: ReactElement) {
	const current = wip.alternate;

	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
