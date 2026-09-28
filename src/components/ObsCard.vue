<template>
	<div class="wrap">
		<div class="img-container">
			<img loading="lazy" :src="'https://storage.googleapis.com/seh-bees/images/'+obs.imageID+'.jpg'">
		</div>

		<div class="taxa">
			<span class="beeChip">
				<FilterChip facet="bee" inline :value="obs.genus"  @select="$emit('set-filter', 'bee', obs.genus)"/>
				<span class="lastname" :if="lastNamePart">{{lastNamePart}}</span>
			</span>
			

			<span class="plantChip">
				<FilterChip facet="plant" inline :score="(obs.plantDetections[0].score).toFixed(2)" :value="obs.plantDetections[0].genus"  @select="$emit('set-filter', 'plant', obs.plantDetections[0].genus)"/>
			</span>
		</div>
		
		<p>Observed <span v-if="obs.identifiedBy">by {{observerName}}</span>
			<span v-if="obs.eventDate && obs.identifiedBy">, </span>
			<span v-if="obs.eventDate">{{obsDate}}</span>
		</p>

		<p>Data source: {{obs.dataResourceName}}; Full record:  <a v-if="obs.occurrenceID" :href="'https://biocache.ala.org.au/occurrences/'+obs.occurrenceID" target="_blank">ALA</a></p>
	</div>
</template>

<script>

	import FilterChip from './FilterChip.vue'

	export default {

	  name: 'FocusConnection',
	  props: ['obs'],
	  components: { FilterChip },
	  emits: ['set-filter'],

	  data () {
	    return {

	    }
	  },

	  computed: {
		lastNamePart(){
			// get the last part of the sci name if the name has more than one part
			let nameparts = this.obs.scientificName.split(" ");
			let lastpart;
			if (nameparts.length > 1) {
				lastpart = nameparts[nameparts.length-1]
			} else {
				return null;
			}
			if (lastpart.charAt(0) != '(') return lastpart;
			return null;
		},

		obsDate(){
			let d = new Date(this.obs.eventDate)
			const formattedDate = d.toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'numeric',
				year: 'numeric'
			});
			return formattedDate;
		},

		observerName(){
			let n = this.obs.identifiedBy;
			if (this.obs.dataResourceName == "Earth Guardians Weekly Feed" && n != ""){
				const parser = new DOMParser();
  				const doc = parser.parseFromString(n, 'text/html');
				return doc.body.textContent || '';
			}
			return n;
		}

	  }
	}
</script>

<style lang="css" scoped>

	.wrap{
		margin:0 auto;
		padding: 1rem;
		max-width: 400px;
    	box-sizing: border-box;
    	/* box-shadow: 0 0 26px rgba(0, 0, 0, 0.15); */
		background-color: white;
		border-radius: 0.5rem;
		border: 1px solid rgba(80,80,80,0.2);

	}

	.wrap .img-container{
		width: 100%;
		aspect-ratio: 1;
		margin: 0 auto 0.25rem;
	}

	.img-container img{
	  width: 100%;
	  height: 100%;
	  object-fit: cover; 
	  object-position: center;
	}

	.lastname{
		font-style: italic;
	}

	.taxa{
		position:relative;
		height:1.5rem;
		margin: 0 0.25rem 1.0rem;
		font-size: 90%;
		

	}

	.beeChip, .plantChip{
		position:absolute;
		top:0
	}

	.beeChip{
		left:0;
		display: inline-block;
	}

	.plantChip{
		right:0
	}

	p{
		/* font-family: 'Fira Mono', monospace; */
		font-weight:300;
		font-size:75%;
		margin: 0.1em 0 0;
		text-align: center;
		color: #888;
	}

</style>