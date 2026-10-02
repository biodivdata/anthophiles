

<script setup>
  import { ref } from 'vue'
  import sourceData from '../assets/data/detections-genus-annotated.json'  
</script>


<template>

<div class="page" id="interface">

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
					:active-index="focusIndex"
					:total="viewItems.length"
					@prev="setFocusIndex(focusIndex - 1)"
					@next="setFocusIndex(focusIndex + 1)"
				/>

				<span class="mobile-nav__plant mobile-nav__slot">
					<FilterChip v-if="filter.plant" facet="plant" :value="filter.plant" :closable="!!filter.bee" @close="unsetFilter('plant')"/>
				</span>
			</div>

			<div class="carousel-slot">
				<div class="carousel-column">
					<CarouselPagination
						class="desktop-pagination"
						:active-index="focusIndex"
						:total="viewItems.length"
						@prev="setFocusIndex(focusIndex - 1)"
						@next="setFocusIndex(focusIndex + 1)"
					/>
					<FocusCarousel v-if="focusItem" :items="viewItems" :active-index="focusIndex" @update:active-index="setFocusIndex" @set-filter="setFilter"/>
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

<section class="about" @click="onAboutClick">
  <h3>What is this?</h3>

  <p>The occurrence data collected on big citizen science platforms and aggregators documents the presence of an organism in space and time, often using an image. But these images might also record other information. For example, many observations of bees also show the plants the bees are resting on, feeding on or pollinating; these bee-plant connections are important, but they are rarely recorded in structured data.</p> 
  
  <p><em>Anthophiles</em> experiments with automated classification to identify plants in thousands of bee observations from south-eastern Austalia. This experiment suggests ML might help build a more joined-up view of the living world; it also suggests reasons for caution, as automation plays an increasing role in citizen science and biodiversity data systems.</p>
    
  <h3>What does the data show?</h3>
   
  <p>This data documents 3241 bee-plant observations, involving 36 bee genera and 350 plant genera. The connections show some clear patterns. Honeybees (<em><a href="?bee=Apis" class="deep-link bee">Apis</a> mellifera</em>) forage widely, observed with over 200 plant genera; some native bees like <em><a href="?bee=Hylaeus" class="deep-link bee">Hylaeus</a></em> are more selective, and prefer largely native plants. <em><a href="?bee=Lasioglossum" class="deep-link bee">Lasioglossum</a></em> (sweat bees) frequent native flowers like <em><a href="?plant=Wahlenbergia" class="deep-link plant">Wahlenbergia</a></em> (bluebells) or <em><a href="?plant=Xerochrysum" class="deep-link plant">Xerochrysum</a></em> (paper daisies) as well as introduced plants like cats ear (<em><a href="?plant=Hypochaeris" class="deep-link plant">Hypochaeris</a></em>). <em><a href="?bee=Amegilla" class="deep-link bee">Amegilla</a></em>, the native "digger" and blue-banded bees, are often observed on garden plants like <em><a href="?plant=Salvia" class="deep-link plant">Salvia</a></em> (rosemary and sage), <em><a href="?plant=Solanum" class="deep-link plant">Solanum</a></em> (which includes tomatoes and eggplant), and lavender (<em><a href="?plant=Lavandula" class="deep-link plant">Lavandula</a></em>).
  </p>

  <p>These patterns are indicative, not definitive; many of these observations come from citizen science platforms, and they reflect well-known patterns in such data. Many observations come from urban and residential areas, because that's where the observers are. In the sciences these patterns are often framed as bias; they could also be framed as documenting connections between people, non-human species and place. In this data the flowers and plants of home gardens are ubiquitous. The garden emerges as a key meeting place for human and non-human anthophiles.</p>  

  <h3>Machine Learning for More-Than-Human Data</h3>

  <p>The plants here are identified using <a href="https://imageomics.github.io/bioclip-2/" target="_blank">BioCLIP 2</a>, a specialised machine-learning model. While the model is highly capable, this experiment also revealed some of its quirks. </p>

  <p>While we can filter BioCLIP's classifications to focus on plants, BioCLIP can't "unsee" the  bee that's also in the image. This visual information interferes with the plant classification. Redacting the bee by blurring it out helps with this, improving the accuracy of the identification as shown below. To process all 13,000 images in the source data a second vision model, <a href="https://github.com/agentmorris/MegaDetector" target="_blank">Megadetector</a>, is used to identify the bee within the frame and blur that area, before passing it to BioCLIP.</p>

  <div class="figure-block">
	<figure class="about-figure">
		<img src="/assets/img/Exoneura-Rubus-orig.jpg">
		<figcaption>Unblurred: plant ID <em>Daviesia</em> (0.1)</figcaption>
	</figure>

		<figure class="about-figure">
		<img src="/assets/img/Exoneura-Rubus-blurred.jpg">
		<figcaption>Blurred: plant ID <em>Rubus</em> (0.9)</figcaption>
	</figure>
  </div>

<p>Some of the 16,000 source images don't show identifiable plants at all; they show bees on the ground, on human hands, on windowsills, and so on. When asked to identify a plant in these cases BioCLIP often gives strange results. Images with hands like the example below are often identified as <em>Stelis</em> - a genus of tiny orchids. This is likely because <a href="https://www.inaturalist.org/observations?taxon_id=141523" target="_blank">photographs</a> of <em>Stelis</em> orchids often include the photographer's hand; but there's also a northern-hemisphere bee genus called <em>Stelis.</em> BioCLIP is a text-image model — trained solely to compare and contrast text-image pairs. In this case similarities in the training data in both text (name) and image fools the model completely. Many other plantless images are classified as <em>Tetradium</em> - a genus of trees found in China and Korea. <em>Tetradium danielli</em> is also known as the "bee bee tree". These errors show something of how models like this operate, through machine-made webs of similarity and difference. These are mostly very effective, and occasionally completely wrong.</p>  

  <div class="figure-block">
	 <figure class="about-figure">
		<img src="/assets/img/stelis-falseID-example.jpg">
		<figcaption>Plant ID <em>Stelis</em> (0.7)</figcaption>
	</figure>

	<figure class="about-figure">
		<img src="/assets/img/tetradium-falseID-example.jpg">
		<figcaption>Plant ID <em>Tetradium</em> (0.5)</figcaption>
	</figure>
  </div>

    <h4>Tech docs</h4>


  <ol>
    <li><strong>Source data:</strong> Atlas of Living Australia bee observations (Superfamily <em>Apoidea</em>) in the IBRA <a href="https://www.environment.nsw.gov.au/topics/animals-and-plants/biodiversity/bioregions/bioregions-of-nsw/south-eastern-highlands" target="_blank">South-Eastern Highlands</a> bioregion. Why this region? It's where I live, and it gives a usable 25,000 or so records. This source data is available <a href="https://doi.org/10.26197/ala.6f6eb117-96d3-4f33-b2bb-1990e6454104">here</a>.   
    </li>

    <li><strong>Download images:</strong> around 16,000 of these records include images.</li>

    <li><strong>Filter for plants:</strong> not all of these images include visually recognisable plants. A custom linear classifier filters out non-plant images, leaving around 5000 records.</li>

    <li><strong>Blur the bees:</strong> a second automated process tries to identify the bee in the image, blurring this area to prevent interference with the plant identification. </li>

    <li><strong>Identify plants:</strong> finally, the blurred image is passed to <a href="https://imageomics.github.io/bioclip-2/" target="_blank">BioCLIP 2</a>, a specialised vision-language model that runs locally. BioCLIP returns the plant genus and a proximity score</li>

    <li><strong>Filter by score:</strong> the lowest-scoring IDs tend to be inaccurate. The interface above shows the 3200 observations where the plant ID scores over 0.4. The confidence score is shown on each plant observation card. </li>

  </ol>
    
    

  



</section>

</template>

<script>
	  import FacetList from './components/FacetList.vue'
	  import CirclePack from './components/CirclePack.vue'
	  import FocusCarousel from './components/FocusCarousel.vue'
	  import FilterChip from './components/FilterChip.vue'

	  import CarouselPagination from './components/CarouselPagination.vue'
	  import { parseURLState, pushURLState, debouncedReplaceURLState, normalizeGenus } from './urlState.js'

export default {

  name: 'App',

  components:{ 
  	FacetList, CirclePack, FocusCarousel, FilterChip, CarouselPagination
  },

  data () {
    return {
    	items:sourceData,
    	filter: {bee:null, plant:null},
    	minScore:0.4,
    	// Focus is tracked by the observation's stable occurrenceID 
    	focusedOccurrenceID: null,
    	// Set once the URL has been parsed on mount, so watchers know
    	// whether to push a new history entry or just replace in place.
    	urlStateReady: false
    }
  },

  mounted(){
  	this._replaceURLState = debouncedReplaceURLState();

  	if (!this.applyStateFromURL()) {
  		let r = this.pickConnection()
  		this.filter.bee = r.genus;
  		this.filter.plant = r.plantDetections[0].genus;
  		this.focusedOccurrenceID = r.occurrenceID;
  	}

  	this.urlStateReady = true;
  	// Write the resolved initial state (random pick or URL-derived) back
  	// to the URL, replacing rather than pushing since this is the page's
  	// starting point, not a user-driven navigation.
  	this.syncURLState(false);

  	window.addEventListener('popstate', this.onPopState);
	},

	beforeUnmount(){
		window.removeEventListener('popstate', this.onPopState);
		if (this._replaceURLState) this._replaceURLState.cancel();
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

  	// Derived from focusedOccurrenceID rather than stored directly, so it
  	// always reflects a valid position within the current (possibly
  	// filtered) viewItems list. Falls back to 0 if the focused item is not
  	// present in the current view (e.g. filters changed).
  	focusIndex(){
  		if (!this.focusedOccurrenceID) return 0;
  		const i = this.viewItems.findIndex(item => item.occurrenceID === this.focusedOccurrenceID);
  		return i === -1 ? 0 : i;
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
			let facetItems = sourceItems.filter(i => i.plantDetection.genus == g);
			let averageNative = facetItems.map(m => m.nativeStatus).reduce((i,a) => a += i,0) / facetItems.length;
			let nativeClass = "introduced";
			if (averageNative > 0.2) nativeClass = "mixed"
			if (averageNative > 0.8) nativeClass = "native"
  			return {genus:g, native: nativeClass, detections: facetItems }
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
  			this.resetFocusToFirstViewItem();
  			this.syncURLState(true);
  			return;
  		}
  		this.filter.bee = beeGenus;
  		this.resetFocusToFirstViewItem();
  		this.syncURLState(true);
  	},

  	setPlantFilter(plantGenus){
  		if (this.filter.plant == plantGenus) {
  			this.filter.plant = ""
  			this.resetFocusToFirstViewItem();
  			this.syncURLState(true);
  			return;
  		}
  		this.filter.plant = plantGenus;
  		this.resetFocusToFirstViewItem();
  		this.syncURLState(true);
  	},

  	setFilter(facet,value){
  		// this.viewSize = 100;
  		if (facet == "bee") this.setBeeFilter(value);
  		if (facet == "plant") this.setPlantFilter(value);
  	},

  	unsetFilter(field){
  		this.filter[field] = "";
  		this.resetFocusToFirstViewItem();
  		this.syncURLState(true);
  	},

  	resetFocusToFirstViewItem(){
  		const first = this.viewItems[0];
  		this.focusedOccurrenceID = first ? first.occurrenceID : null;
  	},

  	pickConnection(){
  			return this.viewItems[Math.floor(Math.random() * this.viewItems.length)];
  	},

  	// Move focus to a given index within the current viewItems list,
  	// wrapping is intentionally NOT applied here (pagination buttons are
  	// disabled at the ends) - clamps defensively instead.
  	setFocusIndex(i){
  		if (i < 0 || i > this.viewItems.length - 1) return;
  		const item = this.viewItems[i];
  		if (!item) return;
  		this.focusedOccurrenceID = item.occurrenceID;
  		// Frequent, low-significance navigation - replace in place rather
  		// than pushing a new history entry per swipe/click.
  		this.syncURLState(false);
  	},

  	nextItem(){
  		this.setFocusIndex(this.focusIndex + 1 > this.viewItems.length - 1 ? 0 : this.focusIndex + 1);
  	},

  	/**
  	 * Read bee/plant/obs from the current URL and, if the referenced
  	 * state actually exists in the dataset, apply it. Returns true when
  	 * URL state was applied, false when there was nothing usable (caller
  	 * should fall back to the default random pick).
  	 */
  	applyStateFromURL(){
  		const { bee, plant, obs } = parseURLState();

  		let obsItem = null;
  		if (obs) {
  			obsItem = this.matches.find(item => item.occurrenceID === obs) || null;
  		}

  		// An observation link is the most specific case: derive bee/plant
  		// from it directly so a single ?obs=<id> link is enough on its own.
  		if (obsItem) {
  			this.filter.bee = obsItem.genus;
  			this.filter.plant = obsItem.plantDetections[0].genus;
  			this.focusedOccurrenceID = obsItem.occurrenceID;
  			return true;
  		}

  		const beeValid = bee && this.beeGenera.some(g => g.genus === bee);
  		const plantValid = plant && this.plantGenera.some(g => g.genus === plant);

  		if (!beeValid && !plantValid) return false;

  		if (beeValid) this.filter.bee = bee;
  		if (plantValid) this.filter.plant = plant;

  		this.resetFocusToFirstViewItem();
  		return true;
  	},

  	/**
  	 * Keep the URL in sync with current filter/focus state.
  	 * @param {boolean} isCheckpoint - true for meaningful filter changes
  	 *   (pushState, worth a back-button stop); false for frequent
  	 *   focus/carousel navigation (debounced replaceState).
  	 */
  	syncURLState(isCheckpoint){
  		// Ignore state changes made while still setting up the initial
  		// state on mount (random pick or URL-derived) - the URL is written
  		// once, deliberately, right after mount finishes instead.
  		if (!this.urlStateReady) return;

  		const state = {
  			bee: this.filter.bee || '',
  			plant: this.filter.plant || '',
  			obs: this.focusedOccurrenceID || ''
  		};

  		if (isCheckpoint) {
  			if (this._replaceURLState) this._replaceURLState.cancel();
  			pushURLState(state);
  		} else {
  			this._replaceURLState(state);
  		}
  	},

  	onPopState(){
  		this.applyStateFromURL();
  	},

  	/**
  	 * Intercept clicks on inline "?bee=...&plant=..." links within the
  	 * .about prose so they update the interface in place (SPA-style)
  	 * instead of forcing a full page reload. External links (ALA,
  	 * BioCLIP, doi.org, etc.) are left alone.
  	 *
  	 * The link's params represent the *complete* desired filter state,
  	 * not a patch - a bee-only link clears any existing plant filter,
  	 * and vice versa, so e.g. "?bee=Apis" always means "show Apis alone".
  	 */
  	onAboutClick(e){
  		const link = e.target.closest('a');
  		if (!link) return;

  		const href = link.getAttribute('href') || '';
  		if (!href.startsWith('?')) return;

  		e.preventDefault();

  		const params = new URLSearchParams(href.slice(1));
  		const bee = normalizeGenus(params.get('bee') || '');
  		const plant = normalizeGenus(params.get('plant') || '');

  		this.filter.bee = (bee && this.beeGenera.some(g => g.genus === bee)) ? bee : "";
  		this.filter.plant = (plant && this.plantGenera.some(g => g.genus === plant)) ? plant : "";

  		this.resetFocusToFirstViewItem();
  		this.syncURLState(true);
  		this.scrollToInterface();
  	},

  	scrollToInterface(){
  		const el = document.getElementById('interface');
  		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  	}
  }
}
</script>

<style lang="css" scoped>

	p{
		font-family: 'Noto Sans';
		font-weight: 400;
		color:#444;
	}

	/* Inline links within .about that update the interface's filter
	   state (bee/plant genus deep-links), intercepted via onAboutClick.
	   Styled distinctly from plain external reference links. */
	.about :deep(a.deep-link){
		color: inherit;
		text-decoration: underline dashed;
		text-underline-offset: 2px;
		cursor: pointer;
	}

	.about :deep(a.deep-link.bee, a.deep-link.bee:hover){
		color: var(--color-bee);
	}

	.about :deep(a.deep-link.plant, a.deep-link.plant:hover){
		color: var(--color-plant);
	}

	h1.main-title{
		font-family: 'Cormorant', sans-serif;
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

 /* .item{
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
 } */

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
 		/* position: sticky; */
 		top: 0;
 		/* z-index: 5; */
 		background-color: rgb(244,244,241);
 		padding: 0.5rem 0;
		margin-bottom: 1rem;
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