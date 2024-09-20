class VNode {
    constructor(type, props, children) {
        this.type = type;
        this.props = props || {};
        this.children = children || [];
    }
}

function reconcile(oldVNode, newVNode, container) {
    // If there's no old node, create a new one
    if (!oldVNode) {
        const newElement = document.createElement(newVNode.type);

        for (const [key, value] of Object.entries(newVNode.props)) {
            if (key === 'className') {
                newElement.setAttribute('class', value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                newElement.addEventListener(key.toLowerCase().substr(2), value);
            } else {
                newElement.setAttribute(key, value);
            }
        }

        for (const child of newVNode.children) {
            if (typeof child === 'string') {
                newElement.appendChild(document.createTextNode(child));
            } else {
                reconcile(null, child, newElement);
            }
        }

        container.appendChild(newElement);
        return newElement;
    }

    if (!newVNode) {
        container.removeChild(oldVNode);
        return null;
    }

    if (oldVNode.nodeType === Node.TEXT_NODE && typeof newVNode === 'string') {
        if (oldVNode.textContent !== newVNode) {
            oldVNode.textContent = newVNode;
        }
        return oldVNode;
    }

    if (typeof oldVNode === 'string' && newVNode instanceof VNode) {
        const newElement = reconcile(null, newVNode, container);
        container.replaceChild(newElement, oldVNode);
        return newElement;
    }

    if (oldVNode.nodeName.toLowerCase() !== newVNode.type) {
        const newElement = reconcile(null, newVNode, container);
        container.replaceChild(newElement, oldVNode);
        return newElement;
    }

    const oldProps = oldVNode.attributes ? Array.from(oldVNode.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
    }, {}) : {};

    for (const [key, value] of Object.entries(newVNode.props)) {
        if (oldProps[key] !== value) {
            if (key === 'className') {
                oldVNode.setAttribute('class', value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                oldVNode.addEventListener(key.toLowerCase().substr(2), value);
            } else {
                oldVNode.setAttribute(key, value);
            }
        }
    }

    for (const key of Object.keys(oldProps)) {
        if (!(key in newVNode.props)) {
            oldVNode.removeAttribute(key);
        }
    }

    const oldChildren = Array.from(oldVNode.childNodes);
    const newChildren = newVNode.children;

    const maxChildrenLength = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < maxChildrenLength; i++) {
        reconcile(
            oldChildren[i],
            newChildren[i],
            oldVNode
        );
    }

    return oldVNode;
}

const oldTree = new VNode('div', { id: 'container' }, [
    new VNode('h1', {}, ['Todo Title 1']),
    new VNode('p', {}, ['Todo Description 1']),
]);

const newTree = new VNode('div', { id: 'container' }, [
    new VNode('h1', {}, ['Todo Title 2']),
    new VNode('p', {}, ['Todo Description 2']),
]);

let root = document.getElementById('root');
if (!root) {
    root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
}

reconcile(null, oldTree, root);
setTimeout(() => reconcile(root.firstChild, newTree, root), 5000);