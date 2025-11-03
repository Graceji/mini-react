import { Key, Props } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: KeyboardEvent;
	stateNode: any;
	index: number;
	ref: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;

	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		// HostComponent <div></div> div dom
		this.stateNode = null;
		// FunctionComponent () => {}
		this.type = null;

		// 构成树状结构·
		// 指向父fiberNode
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;
		this.ref = null;

		// 工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;

		this.alternate = null;

		// 副作用
		this.flags = NoFlags;
	}
}
