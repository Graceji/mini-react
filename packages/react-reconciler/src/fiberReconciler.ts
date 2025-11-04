import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	createUpdate,
	createUpdateQueue,
	equeueUpdate,
	UpdateQueue
} from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

/**
 * 执行ReactDom.createRoot以后，createRoot方法内部会执行createContainer
 * 创建FiberRootNode, 并将FiberRootNode与hostRootFiber连接起来
 *
 * @export
 * @param {type} params
 */
export function createContainer(container: Container) {
	// ReactDom.createRoot(rootElement), rootElement对应的fiber节点
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

/**
 * 当执行render方法后，render方法中会执行updateContainer
 * 创建Update，并将update enque到updateQueue中，就将首屏渲染与触发更新的机制连接起来
 *
 * @export
 * @param {type} container
 */
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	// 首屏渲染，创建更新
	// 并将更新插入到hostRootFiber updateQueue中
	const update = createUpdate<ReactElementType | null>(element);
	equeueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);

	scheduleUpdateOnFiber(hostRootFiber);

	return element;
}
