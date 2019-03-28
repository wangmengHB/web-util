import G6, { Util } from '@antv/g6';
import * as d3 from 'd3';

const WIDTH = 800;
const HEIGHT = 600;
const BLOCK_WIDTH = 100;
const BLOCK_HEGHT = 30;


const MIN_TRIANGEL = 3;
const MIN_ARROW_SIZE = 3;

G6.registerEdge('customEdge', {

  // 设置状态
  setState(name, value, item) {
    const group = item.getContainer();
    const items = group.get('children');
    if (!Array.isArray(items)) {
      return;
    }
    items.forEach(shape => {
      if(name === 'hidden') {
        if(value) {
          shape.attr('opacity', 0.1);
        } else {
          shape.attr('opacity', 1);
        }
      }
      if (name === 'selected') {
        if(value) {
          // shape.attr('lineWidth', 2);
          shape.attr('stroke', '#0000ff');
          shape.attr('fillOpacity', 0.8);
          
        } else {
          // shape.attr('lineWidth', 2);
        }
      }
    })    
  },
  
  draw(cfg, group) {
    const { startPoint, endPoint } = cfg;
    
    let hgap = endPoint.x - startPoint.x;
    let vgap = endPoint.y - startPoint.y;
    const path = [
      ['M', startPoint.x, startPoint.y], 
      [
        'C',
        startPoint.x + hgap/ 4,  startPoint.y + vgap /2,
        startPoint.x + hgap * 3 / 4, startPoint.y + vgap/2,
        endPoint.x - 3, endPoint.y - 3
      ]
    ];

    group.addShape('path', {
      attrs: {
        path,
        stroke: '#e2e2e2',
        lineWidth: 1
      }
    });
    
    return group.addShape('circle', {    
      attrs: {
        x: endPoint.x,
        y: endPoint.y,
        r: 5,
        fill: '#FF00FF',
      } 
    })
  },

});


const MIN_GAP = 40;

G6.registerEdge('arrow', {
  draw(cfg, group) {
    const { startPoint, endPoint } = cfg;
    let hgap = endPoint.x - startPoint.x;
    let vgap = endPoint.y - startPoint.y;
    const ratio = MIN_GAP / Math.sqrt( hgap ** 2 + vgap ** 2);
    const realEndPoint = {
      x: endPoint.x - ratio * hgap,
      y: endPoint.y - ratio * vgap
    };
    let deltaX = (MIN_GAP /3) * vgap / Math.sqrt( hgap ** 2 + vgap ** 2);
    let deltaY = (MIN_GAP /3) * hgap / Math.sqrt( hgap ** 2 + vgap ** 2);

    // deltaX = 10;
    // deltaY = deltaX * hgap / vgap;
  

    const p1 = {
      x: realEndPoint.x + deltaX,
      y: realEndPoint.y - deltaY,
    }
    const p2 = {
      x: realEndPoint.x - deltaX,
      y: realEndPoint.y + deltaY,
    }


    group.addShape('polyline', {
      attrs: {
        points: [
          [startPoint.x, startPoint.y],
          [realEndPoint.x, realEndPoint.y],
        ],
        stroke: '#e2e2e2',
        lineWidth: 1
      }
    });
    
    return group.addShape('polyline', {    
      attrs: {
        points: [
          [realEndPoint.x, realEndPoint.y],
          [p1.x, p1.y],
          [endPoint.x, endPoint.y],
          [p2.x, p2.y],
          [realEndPoint.x, realEndPoint.y],
        ],
        stroke: '#FF00FF',
      } 
    })
  }
})





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
    .force('collision', d3.forceCollide().radius(d => d.size[0] / 2 + 100));
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
      shape: 'arrow',
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
        lineWidth: 10,
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
