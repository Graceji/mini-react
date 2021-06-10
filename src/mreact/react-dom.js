function render(vnode, container) {
    // vnode => node
    const node = createNode(vnode);
    
    // node => container
    container.appendChild(node);

}

const createNode = (vnode) => {
    let node;
    // todo 根据不同组件类型，创建不同的node节点

    const { type } = vnode;
    console.log('type', type)

    if (typeof type === 'string') {
        node = updateHostComponent(vnode);
    } else if (typeof type === 'function') {
        if (type.prototype.isReactComponent) {
            node = updateClassComponent(vnode);
        } else {
            node = updateFunctionComponent(vnode);
        }
    } else {
        node = updateTextComponent(vnode);
    }

    return node;
};

// 原生标签
function updateHostComponent (vnode) {
    const {type, props} = vnode;
    const node = document.createElement(type);

    updateNode(node, props); // 属性

    reconcileChildren(node, props.children); // 遍历children

    return node;
}

// 文本
function updateTextComponent(vnode) {
    return document.createTextNode(vnode);
}

// 函数组件
function updateFunctionComponent(vnode) {
    const {type, props} = vnode;
    const vvnode = type(props);

    // vvnode => node
    const node = createNode(vvnode)
    return node;
}

// 类组件
function updateClassComponent(vnode) {
    const {type, props} = vnode;
    const vvnode = new type(props).render();

    // vvnode => node
    const node = createNode(vvnode, props);
    return node;
}

function reconcileChildren(parentNode, children) {
    const newChildren = Array.isArray(children) ? children : [children];

    newChildren.forEach((child) => {
        // vnode => node
        // node => parentNode
        render(child, parentNode);
    });
}

// 更新属性
function updateNode(node, props) {
    Object.keys(props).forEach((key) => {
        if (key !== 'children') {
            node[key] = props[key];
        }
    })
}

export {
    render,
};
