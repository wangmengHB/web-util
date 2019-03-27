
let uid = 0;

let idSet = new Set();

function createNode() {
  let id = uid++;
  idSet.add(id); 
  return {
    id: String(id),
    label: `node ${id}`
  }
}

function createEdge() {
  const arr = Array.from(idSet);
  const index1 = Math.floor(Math.random() * arr.length);
  const index2 = Math.floor(Math.random() * arr.length);

  const source = String(arr[index1]);
  const target = String(arr[index2]);
  return {
    source,
    target
  }
}



export default {
  nodes: [
    createNode(),
    createNode(),
    createNode(),
    createNode(),
  ],
  edges: [
    createEdge(),
    createEdge(),
    createEdge(),
    createEdge(),
  ]

}