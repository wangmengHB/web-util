import G6 from '@antv/g6';
import * as d3 from 'd3';

const WIDTH = 800;
const HEIGHT = 600;
const BLOCK_WIDTH = 100;
const BLOCK_HEGHT = 30;



function doLayout(nodes, edges, graph) {
  const simulation = d3
    .forceSimulation()
    .force('charge', d3.forceManyBody().strength(20))
    .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .force(
      'link',
      d3
        .forceLink()
        .id(d => d.id)
        .strength(0.001)
      // .distance(1)
      // .iterations(1)
    )
    .force('collision', d3.forceCollide().radius(d => d.size[0] / 2));
  simulation.nodes(nodes).on('tick', () => {
    graph.refreshPositions();
  });

  simulation.force('link').links(edges);
}



export function drawGraph({nodes, edges}, containerEleId) {
  const graph = new G6.Graph({
    container: containerEleId,
    width: WIDTH,
    height: HEIGHT,
    defaultNode: {
      size: [BLOCK_WIDTH, BLOCK_HEGHT],
      shape: 'rect',
    },
    defaultEdge: {
      shape: 'line'
    },
    nodeStyle: {
      default: {
        fill: '#fff',
        stroke: 'steelblue',
        lineWidth: 1,
        opacity: 1,
      },
      selected: {
        lineWidth: 3,
        fillOpacity: 1,
        stroke: '#ff0000',
        opacity: 1,
      },
      hidden: {
        opacity: 0.1,
      },
    },
    edgeStyle: {
      default: {
        lineWidth: 1,
        stroke: '#e2e2e2',
        fillOpacity: 0.2,
        opacity: 1,
      },
      selected: {
        lineWidth: 2,
        stroke: '#0000ff',
        fillOpacity: 0.8,
        opacity: 1,
      },
      hidden: {
        opacity: 0.1,
      },
    },
  });

  graph.clear();
  
  graph.data({
    nodes,
    edges,
  });
  debugger;
  graph.render();
  

  doLayout(nodes, edges, graph);


}
