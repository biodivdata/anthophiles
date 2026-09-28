

<script setup>
  import { ref } from 'vue'
  import sourceData from '../assets/data/detections-genus-annotated.json'  
</script>


<template>

<div class="page">

<div class="facets">
	<CirclePack class="pack-bee" :list-data="beeGenera" facet="bee" facet-title="Bees" :filter-state="filter" @set-filter="setFilter"></CirclePack>
	<CirclePack class="pack-plant" :list-data="plantGenera" facet="plant" facet-title="Plants" :filter-state="filter" @set-filter="setFilter"></CirclePack>
</div>


	<!-- <h4>{{focusIndex+1}} of {{viewItems.length}}  <span @click="nextItem">></span></h4>  -->

	 	<div class="flex-row">

	 		<div class="col beePanel">
	 			<div class="inner" v-if="filter.bee">
		 			<p class="chip-label">
		 				<FilterChip facet="bee" :value="filter.bee" :closable="!!filter.plant" @close="unsetFilter('bee')"/>
		 			</p>

		 			<div class="detail">
		 			<p><span v-if="beeStats.native">A native</span> 
		 				 <span v-if="!beeStats.native">An introduced</span>
		 			bee genus</p>

		 			<p class="tall-lines">Most connected with 
			 			<span v-for="(p,i) in beeStats.topPlants">
			 				<FilterChip facet="plant" :value="p.plant" inline @select="setFilter('plant',p.plant)"/>
			 				<span v-if="i==1"> and </span>
			 			</span> plants
			 		</p>

			 		<p>Connected with a 
			 				<span v-if="beeStats.plantBreadth <= 0.1">narrow</span>
			 				<span v-if="beeStats.plantBreadth >= 0.3">broad</span>
			 				<span v-if="beeStats.plantBreadth < 0.3 && beeStats.plantBreadth > 0.1">moderate</span> range of plant genera ({{beeStats.plantBreadth.toLocaleString('en-US', { style: 'percent' })}})

			 			</p>

		 		</div>
		 		</div>

	 		</div>
	 		
	
			<div class="mobile-nav">
				<span class="mobile-nav__bee mobile-nav__slot">
					<FilterChip v-if="filter.bee" facet="bee" :value="filter.bee" :closable="!!filter.plant" @close="unsetFilter('bee')"/>
				</span>

				<CarouselPagination
					class="mobile-nav__pagination"
					:active-index="carouselIndex"
					:total="viewItems.length"
					@prev="carouselIndex--"
					@next="carouselIndex++"
				/>

				<span class="mobile-nav__plant mobile-nav__slot">
					<FilterChip v-if="filter.plant" facet="plant" :value="filter.plant" :closable="!!filter.bee" @close="unsetFilter('plant')"/>
				</span>
			</div>

			<div class="carousel-slot">
				<div class="carousel-column">
					<CarouselPagination
						class="desktop-pagination"
						:active-index="carouselIndex"
						:total="viewItems.length"
						@prev="carouselIndex--"
						@next="carouselIndex++"
					/>
					<FocusCarousel v-if="focusItem" :items="viewItems" v-model:active-index="carouselIndex" @set-filter="setFilter"/>
				</div>
			</div>

			<div class="col plantPanel">
				<div class="inner" v-if="filter.plant">
					<p class="chip-label">
						<FilterChip facet="plant" :value="filter.plant" :closable="!!filter.bee" @close="unsetFilter('plant')"/>
					</p>

					<div class="detail">
					<p>
						<span v-if="plantStats.native > 0.8">A native</span>
						<span v-if="plantStats.native < 0.2">An introduced</span>
						<span v-if="plantStats.native > 0.2 && plantStats.native < 0.8">A mixed</span>
						plant genus</p>

					<p class="tall-lines">Most connected with 
						<span v-for="(b,i) in plantStats.topBees">
							<FilterChip facet="bee" :value="b.bee" inline @select="setFilter('bee',b.bee)"/>

							<span v-if="i == plantStats.topBees.length - 2"> and </span>
						</span> bees
					</p>

					<p>Connected with a 
						<span v-if="plantStats.beeBreadth <= 0.1">narrow</span>
						<span v-if="plantStats.beeBreadth >= 0.3">broad</span>
						<span v-if="plantStats.beeBreadth < 0.3 && plantStats.beeBreadth > 0.1">moderate</span> range of bee genera ({{plantStats.beeBreadth.toLocaleString('en-US', { style: 'percent' })}})
					</p>
					</div>

				</div>
			</div>

	 	</div>

	 	

</div>

</template>

<script>
	  import FacetList from './components/FacetList.vue'
	  import CirclePack from './components/CirclePack.vue'
	  import FocusCarousel from './components/FocusCarousel.vue'
	  import FilterChip from './components/FilterChip.vue'

	  import CarouselPagination from './components/CarouselPagination.vue'
export default {

  name: 'App',

  components:{ 
  	FacetList, CirclePack, FocusCarousel, FilterChip, CarouselPagination
  },

  data () {
    return {
    	items:sourceData,
    	filter: {bee:null, plant:null},
    	carouselIndex:0,
    	minScore:0.4,
    	focusIndex:0
    }
  },

  mounted(){
  	let r = this.pickConnection()
		this.setBeeFilter(r.genus)
		this.setPlantFilter(r.plantDetections[0].genus)
	},

  computed:{

  	matches(){
  		// original data structure
  		// let sourceItems = this.items.filter(i => i.plantDetections[0].score > this.minScore)
  		
  		// new data structure
  		let sourceItems = this.items.filter(i => i.genus != "" && i.hasPlant && i.plantDetection.score > this.minScore)
  		console.log(sourceItems.length + " items over " + this.minScore)
  		return sourceItems;
  	},

  	focusItem(){
  		return this.viewItems[this.focusIndex];
  	},
  	
  	beeGenera(){
  		let sourceItems = this.matches;
  		const allGenusSet = new Set(sourceItems.map(i => i.genus));
  		const allGenus = [...allGenusSet];
  		const genusFacets = allGenus.map(g => { 
  			return {genus:g, detections: sourceItems.filter(i => i.genus == g)}
  		});
  		return genusFacets;
  	},

  	plantGenera(){
  		let sourceItems = this.matches;
  		const allGenusSet = new Set(sourceItems.map(i => i.plantDetections[0].genus));
  		const allGenus = [...allGenusSet];
  		const genusFacets = allGenus.map(g => { 
  			return {genus:g, detections: sourceItems.filter(i => i.plantDetections[0].genus == g)}
  		});
  		return genusFacets;
  	},

  	viewItems(){
  		let filtered = this.matches;
  		if (this.filter.bee) filtered = this.matches.filter(i => i.genus == this.filter.bee)
  		if (this.filter.plant) filtered = filtered.filter(i => i.plantDetections[0].genus == this.filter.plant)
  		let items = filtered.sort((a,b) => a.plantDetections[0].score - b.plantDetections[0].score);
  	  //items.forEach(i => console.log(i.localPath))
  	  return items;
  	},

  	plantStats(){
  		if (!this.filter.plant) return {};
  		let matchingObs = this.matches.filter(p => p.plantDetections[0].genus == this.filter.plant)
  		let averageNative = matchingObs.map(m => m.nativeStatus).reduce((i,a) => a += i,0) / matchingObs.length;

  		let beeRelations = [... new Set( matchingObs.map(o => o.genus))]
  		let beeFacets = beeRelations.map(b => {return {bee:b, count: matchingObs.filter(o => o.genus == b).length  }})
  		  .sort((a,b) => b.count - a.count)

  		return {
  			native: averageNative,
  			topBees: beeFacets.slice(0,3),
  			beeCount: beeFacets.length,
  			beeBreadth: beeFacets.length / this.beeGenera.length
  		}
  	},

  	beeStats(){
  		if (!this.filter.bee) return {};
  		let matchingObs = this.matches.filter(p => p.genus == this.filter.bee)
  		let native = this.filter.bee == "Apis" ? false : true; 

  		let plantRelations = [... new Set( matchingObs.map(o => o.plantDetections[0].genus))]
  		
  		let plantFacets = plantRelations.map(p => {return {plant:p, count: matchingObs.filter(o => o.plantDetections[0].genus == p).length  }})
  		  .sort((a,b) => b.count - a.count)

  		let topThreePlants = plantFacets.slice(0,3);

  		/*

  		// this works, but "superfans" end up being plants with 1 occurrence
			// tricky to filter this out...

  		let globalProportions = plantFacets.map(f =>  {
  			 let globalMatch = this.plantGenera.find(p => p.genus == f.plant)
  			 let proportion = f.count / globalMatch.detections.length;
  			 return {...f, globalProportion: proportion}
  			})

  		let superFans = globalProportions
  			.filter(g => g.globalProportion > 0.3)
  			.sort((a,b) => b.globalProportion - a.globalProportion).slice(0,3)
			console.log(superFans)
			*/

  		return {
  			native: native,
  			topPlants: topThreePlants,
  			plantCount: plantFacets.length,
  			plantBreadth: plantFacets.length / this.plantGenera.length,
  			//superFans: superFans
  		}
  	}

  },

  methods:{
  	setBeeFilter(beeGenus){
  		if (this.filter.bee == beeGenus) {
  			this.filter.bee = ""
  			return;
  		}
  		this.filter.bee = beeGenus;
  		//this.pickConnection()
  		this.focusIndex = 0;
  	},

  	setPlantFilter(plantGenus){
  		if (this.filter.plant == plantGenus) {
  			this.filter.plant = ""
  			return;
  		}
  		this.filter.plant = plantGenus;
  		//this.pickConnection()
  		this.focusIndex = 0;
  	},

  	setFilter(facet,value){
  		// this.viewSize = 100;
  		if (facet == "bee") this.setBeeFilter(value);
  		if (facet == "plant") this.setPlantFilter(value);
  	},

  	unsetFilter(field){
  		this.filter[field] = "";
  	},

  	pickConnection(){
  			return this.viewItems[Math.floor(Math.random() * this.viewItems.length)];
  	},

  	nextItem(){
  		this.focusIndex++;
  		if (this.focusIndex > this.viewItems.length-1) this.focusIndex = 0;
  	}
  }
}
</script>

<style lang="css" scoped>

	p{
		font-family: 'Noto Sans';
		font-weight: 300;
		color:#444;
	}

h4{
	text-align: center;
	margin:0.5rem;
}

ul.items{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: flex-start;
	margin:0;
	padding:0;
}

 .beeFilter{
 	display: inline-block;
 	padding:0.25rem;
 	margin:0.25rem 0.25rem;
 	cursor: pointer;
 	background-color: #eee;
 }

 .item{
 	list-style: none;
 	display: inline-block;
 	width:240px;
 	margin:0.5rem;
 	padding:1.5rem;
 	background-color: #eaeae0;
 }

  .item .metadata {
  	font-weight: 300;
  	font-size:80%;
  }

  .metadata p{
  	margin:0.5rem 0;
  }

 .item img{
 	width:100%;
 	aspect-ratio: 1;
 	object-fit: cover;
 	display: block;
 	margin:0 auto;
 }

 .beeFilter.active{
 	background-color: lightcoral;
 }

.facets{
	display: flex;
	flex-direction: row;
	justify-content: center;
 }

 .carousel-slot { display: contents; }

 .carousel-column{
 	display: flex;
 	flex-direction: column;
 	align-items: stretch;
 	flex: 1.25;
 	min-width: 320px;
 	margin: 0 auto;
 }

 .desktop-pagination{
 	align-self: center;
 	margin-bottom: 0.5rem;
 }

 .mobile-nav__pagination{
 	display: none;
 }

 .flex-row{
 	width:100%;
 	margin:0 auto;
 	max-width:1300px;
 	display: flex;
 	flex-direction: row;
 	flex-wrap: nowrap;
 	justify-content: center;
 	align-items: flex-start;
 }

 .mobile-nav{
 	display: none;
 }

 @media (max-width: 768px){

 	/* Stack the whole page as a single column:
 	   bee circle-pack -> mobile-nav (bee/plant chips) -> carousel -> plant circle-pack.
 	   .page becomes the shared flex context so the carousel
 	   (normally rendered inside .flex-row) can be reordered to
 	   sit between the two CirclePack panels via flex order. */
 	.page{
 		display: flex;
 		flex-direction: column;
 	}

 	.facets{
 		display: contents;
 	}

 	.flex-row{
 		display: contents;
 	}

 	.pack-bee{ order: 1; }
 	.mobile-nav{ order: 2; }
 	.carousel-slot{
 		order: 3;
 		display: block;
 	}

 	.desktop-pagination{
 		display: none;
 	}

 	.mobile-nav__pagination{
 		display: inline-flex;
 	}

 	.carousel-column{
 		min-width: 0;
 		width: 100%;
 	}
 	.pack-plant{ order: 4; }

 	/* The detail stats panels are dropped entirely on mobile to save
 	   vertical space; only a compact mobile-nav strip (below) shows
 	   the currently focused bee/plant chips. */
 	.col.beePanel, .col.plantPanel{
 		display: none;
 	}

 	.mobile-nav{
 		display: flex;
 		flex-direction: row;
 		justify-content: space-between;
 		align-items: center;
 		width: 100%;
 		padding: 0.5rem 1rem;
 		box-sizing: border-box;
 		gap: 0.5rem;
 	}

 	/* Both side slots always occupy equal space (even when their
 	   FilterChip is absent) so the pagination pill in the middle
 	   stays visually centered regardless of which filters are set. */
 	.mobile-nav__slot{
 		flex: 1 1 0;
 		min-width: 0;
 	}

 	.mobile-nav__bee{
 		text-align: left;
 	}

 	.mobile-nav__plant{
 		text-align: right;
 	}

 	.mobile-nav__pagination{
 		flex: 0 0 auto;
 	}

 	.carousel-slot{
 		width: 100%;
 		position: sticky;
 		top: 0;
 		z-index: 5;
 		background-color: rgb(244,244,241);
 		padding: 0.5rem 0;
 	}
 }

 .col{
 	flex:1;
 	padding: 1rem;
 	min-width: 0;

 }

 .col p{
 	line-height: 1.2rem;
 }

 .col p.tall-lines{
	line-height: 1.8rem;
 }

 .col p.chip-label{
	font-size:110%;
 }

 .col.beePanel{
 	text-align: right;
 }

 .col.beePanel, .col.plantPanel{
	margin:0 1rem;
 }
 

.morebutton{
	width:100%;
	text-align: center;
}

.morebutton button{
	color:white;
	background-color: #929281;
	border:none;
	border-radius: 0;
	padding:0.5rem;
	font-weight: 600;
	cursor:pointer;
	opacity:0.8;

}

.morebutton button:hover{
	opacity:1.0;
}

</style>

<!--Taraxacum  https://id.biodiversity.org.au/taxon/apni/51748197 -->