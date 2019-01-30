
function copyNode(node) {
  const newNode = {}
  for (const key in node) {
    newNode[key] = node[key]
  }
  return newNode;
}

export default copyNode
