import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

/**
 * 递归中的归阶段
 *  对于Host类型fiberNode: 构建离屏DOM树
 *  标记Update Flag
 *
 * @param {FiberNode} wip
 */
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;

	switch (wip.tag) {
		case HostRoot:
			// const newState = wip.updateQueue.shared.pending.memoizedState;
			// wip.memoizedState = newState;
			// wip.updateQueue.shared.pending = null;
			bubbleProperties(wip);
			return null;
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// update
				// 1. 删除旧的DOM元素
			} else {
				// mount
				// 1. 构建Dom
				const instance = createInstance(wip.type, newProps);
				// 2. 将Dom 插入到DOM树中
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
				// update
				// 1. 删除旧的DOM元素
			} else {
				// mount
				// 1. 构建Dom
				const instance = createTextInstance(newProps.content);
				// 文本节点没有子节点
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.warn('completeWork未实现的类型');
			}
			break;
	}
};

function appendAllChildren(parent: any, wip: FiberNode) {
	let node = wip.child;

	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === wip || node.return === null) {
				return;
			}
			node = node.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subTreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}
	wip.subTreeFlags = subtreeFlags;
}
