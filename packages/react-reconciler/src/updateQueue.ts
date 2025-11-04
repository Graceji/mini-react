import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

/**
 * 创建update实例
 *
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

export const createUpdateQueue = <State>() => {
	// todo: 这种数据结构的设计是为了让workInprogress fiber和current fiber访问同一个updateQueue
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

/**
 * 更新队列UpdateQueue中添加update
 *
 * @template State
 * @param {UpdateQueue<State>} updateQueue
 * @param {Update<State>} update
 */
export const equeueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

/**
 * 更新队列UpdateQueue中update处理, 消费update方法
 *
 * @template State
 * @param {State} baseState
 * @param {(Update<State> | null)} pendingUpdate
 * @param {number} renderLane
 * @return {*}  {{ memoizedState: State }}
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
		} else {
			result.memoizedState = action;
		}
	}

	return result;
};
