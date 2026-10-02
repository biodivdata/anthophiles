<template>
  <div class="circle-pack-wrap">
    <div class="svg-container">
      <svg :viewBox="`0 0 ${width} ${height}`" class="bubble-chart">
        <!-- Render each bubble group -->
        <g
          v-for="node in packedNodes"
          :key="node.data.genus || 'root'"
          :class="{
            'facet-plant': facet == 'plant',
            'facet-bee': facet == 'bee',
            'bubble-node': true,
            'root-node': !!node.children,
            'focused': !node.children && filterState[facet] === node.data.genus,
            'has-active-sibling': !node.children && filterState[facet] && filterState[facet] !== node.data.genus,
            'no-cooc': isFaded(node)
          }"
          :transform="`translate(${node.x}, ${node.y})`"
          @click="!node.children ? setFilter(node.data.genus) : clearFilter()"
        >

          <!-- Main Bubble -->
          <circle
            :r="node.r"
            class="bubble-circle"
          />

          <!-- Inset Co-occurrence Border Circle -->
          <circle
            v-if="hasCooc(node)"
            :r="node.r - getCoocStrokeWidth(node) / 2"
            class="cooc-border-circle"
            :style="{
              // stroke: getCoocStrokeColor(node),
              strokeWidth: `${getCoocStrokeWidth(node)}px`
            }"
          />

          <!-- Text Labels for Leaf Nodes (only show if radius is large enough) -->
          <g v-if="!node.children && node.r > labelMinRadius" class="label-group">
            <text
              dy="-0.25em"
              class="label-genus"
              :style="{ fontSize: getFontSize(node.r, true) }"
            >
              {{ node.data.genus }}
            </text>
            <text
              dy="1em"
              class="label-count"
              :style="{ fontSize: getFontSize(node.r, false) }"
            >
              {{ node.data.value }}
            </text>
          </g>

          <!-- Native SVG Tooltip -->
          <title>{{ node.data.genus }}: {{ node.data.value }} detections <template v-if="hasCooc(node)">({{ getCoocCount(node) }} co-occurring)</template></title>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { hierarchy, pack } from 'd3';

export default {
  name: 'CirclePack',
  props: {
    listData: {
      type: Array,
      required: true
    },
    facet: {
      type: String,
      required: true
    },
    facetTitle: {
      type: String,
      default: ''
    },
    filterState: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      width: 520,
      height: 520,
      padding: 3,
      labelMinRadius: 15
    };
  },
  computed: {
    packedNodes() {
      if (!this.listData || this.listData.length === 0) return [];

      const margin = 1;
      const rootData = {
        genus: this.facetTitle,
        isRoot: true,
        children: this.listData.map(d => ({
          genus: d.genus,
          value: d.detections ? d.detections.length : 0,
          original: d
        }))
      };

      const rootNode = hierarchy(rootData)
        .sum(d => d.value);

      const packLayout = pack()
        .size([this.width - margin * 2, this.height - margin * 2])
        .padding(this.padding);

      packLayout(rootNode);

      // Return all descendants including the root node
      return rootNode.descendants();
    }
  },
  methods: {
    setFilter(genus) {
      this.$emit('setFilter', this.facet, genus);
    },
    clearFilter() {
      this.$emit('setFilter', this.facet, null);
    },
    getFontSize(radius, isHeader) {
      // Scale font size dynamically with bubble radius
      const scale = isHeader ? 0.22 : 0.16;
      const size = Math.max(9, Math.min(18, radius * scale));
      return `${size}px`;
    },
    getBubbleColor(node) {
      if (node.children) {
        // return '#ffffff';
        return 'none';
      }
      // const isFocused = this.filterState[this.facet] === node.data.genus;
      // if (isFocused) {
      //   if (this.facet === 'plant') return '#929281';
      // }

      // Generate soft, harmonized colors based on facet type
      // Plants: Sage/Forest greens; Bees: Ochre/Warm ambers
      const hash = this.getHashCode(node.data.genus || '');
      if (this.facet === 'plant') {
        const hue = 80 + (hash % 60); // Sage to green
        return `hsl(${hue}, 30%, 75%)`;
      } else {
        const hue = 35 + (hash % 25); // Ochre to warm amber
        return `hsl(${hue}, 45%, 72%)`;
      }
    },
    getHashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    },
    getCoocInfo(node) {
      if (node.children || !node.data.original) return null;
      
      const oppositeFacet = this.facet === 'bee' ? 'plant' : 'bee';
      const oppositeFilter = this.filterState[oppositeFacet];
      if (!oppositeFilter) return null;

      const detections = node.data.original.detections || [];
      let coocCount = 0;

      if (this.facet === 'bee') {
        // opposite is plant
        coocCount = detections.filter(d => 
          d.plantDetections && 
          d.plantDetections[0] && 
          d.plantDetections[0].genus === oppositeFilter
        ).length;
      } else {
        // opposite is bee
        coocCount = detections.filter(d => d.genus === oppositeFilter).length;
      }

      return {
        count: coocCount,
        hasCooc: coocCount > 0,
        r: coocCount > 0 ? node.r * Math.sqrt(coocCount / detections.length) : 0
      };
    },
    hasCooc(node) {
      const cooc = this.getCoocInfo(node);
      return !!(cooc && cooc.hasCooc);
    },
    getCoocCount(node) {
      const cooc = this.getCoocInfo(node);
      return cooc ? cooc.count : 0;
    },
    getCoocStrokeColor(node) {
      if (node.children) {
        return 'none';
      }
      // Return co-occurrence border color (more saturated than bubble background)
      const hash = this.getHashCode(node.data.genus || '');
      if (this.facet === 'plant') {
        const hue = 80 + (hash % 60);
        return `hsl(${hue}, 40%, 42%)`;
      } else {
        const hue = 35 + (hash % 25);
        return `hsl(${hue}, 50%, 45%)`;
      }
    },
    getCoocStrokeWidth(node) {
      if (node.children) {
        return 0;
      }
      const count = this.getCoocCount(node);
      return Math.sqrt(count) * 2;
    },
    isFaded(node) {
      if (node.children) return false;
      const oppositeFacet = this.facet === 'bee' ? 'plant' : 'bee';
      const oppositeFilter = this.filterState[oppositeFacet];
      if (!oppositeFilter) return false;

      const cooc = this.getCoocInfo(node);
      return !cooc || !cooc.hasCooc;
    }
  }
};
</script>

<style lang="css" scoped>
.circle-pack-wrap {
  display: inline-block;
  margin: 0 0.5rem;
}

.svg-container {
  /* Scales fluidly with the viewport while the two-column layout is in
     effect (roughly 768px-1200px), then continues to grow above 1200px
     up to a comfortable maximum of ~540px. Below 768px the single-column
     media query takes over and sizes this relative to the full width. */
  width: clamp(260px, 48vw, 540px);
  aspect-ratio: 1 / 1;
  height: auto;
  /* background-color: rgba(234, 234, 224, 0.5); */
  display: inline-block;
  overflow: hidden;
  border-radius: 4px;
}

.bubble-chart {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
}

@media (max-width: 768px){
  .circle-pack-wrap{
    display: block;
    margin: 0 auto;
  }

  .svg-container{
    width: 90vw;
    height: auto;
    margin: 0 auto;
  }

  .bubble-chart{
    width: 100%;
    height: auto;
  }
}

.bubble-node {
  cursor: pointer;
}

.bubble-node.facet-bee{
  fill: color-mix(in srgb, var(--color-bee) 60%, transparent);
}

.bubble-node.facet-plant{
  fill: color-mix(in srgb, var(--color-plant) 60%, transparent);
}

.bubble-node.root-node {
  cursor: default;
  fill:rgba(255, 255, 255, 0.5);
}



.bubble-circle {
  stroke: rgba(255, 255, 255, 0.8);
  stroke-width: 1.5px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.bubble-node:not(.root-node):hover .bubble-circle {
  stroke: #555;
  stroke-width: 2px;
  filter: brightness(0.95);
}

.bubble-node.root-node .bubble-circle {
  stroke:rgba(0,0,0,0.08);
  stroke-width: 0.5px;
}

/* Focused active node style */
.bubble-node.facet-bee.focused .bubble-circle {
  stroke: #444;
  stroke-width: 2.5px;
  /* fill: var(--color-bee); */
  fill: color-mix(in srgb, var(--color-bee) 80%, transparent);

}

.bubble-node.facet-plant.focused .bubble-circle {
  stroke: #444;
  stroke-width: 2.5px;
  /* fill: var(--color-plant); */
  fill: color-mix(in srgb, var(--color-plant) 80%, transparent);
}


/* De-emphasize non-selected nodes when a filter is active */
.bubble-node.has-active-sibling .bubble-circle {
  opacity: 0.45;
}

.bubble-node.has-active-sibling:hover .bubble-circle {
  opacity: 0.85;
}

.label-group {
  pointer-events: none;
}

.label-genus,
.label-count {
  text-anchor: middle;
  font-family: Noto Sans, sans-serif;
  font-style:italic;
  fill: #2d2d2d;
  font-weight: 400;
  transition: fill 0.3s ease;
}

.label-count {
  font-style:unset;
  font-weight: 300;
  fill: #666;
}

.bubble-node.focused .label-genus,
.bubble-node.focused .label-count {
  fill: #ffffff;
}

/* Inset co-occurrence border styling */
.cooc-border-circle {
  fill: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  pointer-events: none;
}

.facet-bee .cooc-border-circle{
  stroke:#8a582d;
}

.facet-plant .cooc-border-circle{
  stroke:#70944f;
}

/* Faded out styling when co-occurrence doesn't exist */
.bubble-node.no-cooc {
  opacity: 0.5;
  pointer-events: none;
}
</style>
