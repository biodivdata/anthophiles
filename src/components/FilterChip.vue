<template>
	<span class="filterChip"
		:class="[facet, { inline: inline }]"
		@click="onClick">
	{{value}}
		<button v-if="closable"
			class="close-unicode"
			aria-label="Close"
			@click.stop="$emit('close')"
		></button>
	</span>
	<span class="score" v-if="score">
		{{scoreString}}
	</span>
</template>

<script>
	export default {

	  name: 'FilterChip',

	  props: {
	  	facet: { type: String, required: true },   // "bee" | "plant"
	  	value: { type: String, required: true },
	  	inline: { type: Boolean, default: false },  // clickable, muted variant used in lists
	  	closable: { type: Boolean, default: false }, // shows the close (x) button
		score: {type: String, required: false}
	  },

	  computed:{
		scoreString(){
			let s = "" + this.score;
			return s.replace("0","");
		}
	  },

	  emits: ['select', 'close'],

	  methods:{
	  	onClick(){
	  		if (this.inline) this.$emit('select', this.value);
	  	}
	  }
	}
</script>

<style lang="css" scoped>

	.filterChip{
		color:white;
		font-style: italic;
		font-weight:400;
		padding:0.4rem 0.5rem 0.4rem 0.6rem;
		clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%);
		display: inline-block;

	}

	.score{
		display: inline-block;
		font-size: 75%;
		font-style: normal;
		font-weight:500;
		margin:0;
		padding:0.05em 0.4em;
		background-color: #919191;
		color:white;
		position:absolute;
		bottom:-1.0em;
		right:-0.25em;
		clip-path: polygon(0.3em 0, 100% 0, calc(100% - 0.3em) 100%, 0 100%);

	}

	.filterChip.plant{
		background-color: var(--color-plant);
	}

	.filterChip.bee{
		background-color: var(--color-bee);
	}

	.filterChip.inline{
		padding: 0rem 0.5rem 0rem 0.4rem;
		color: black;
		font-weight: 400;
		cursor: pointer;
		display: inline-block;
		line-height: 1.6em;
	}

	.filterChip.bee.inline{
		background-color: color-mix(in srgb, var(--color-bee) 40%, transparent);
	}

	.filterChip.plant.inline{
		background-color: color-mix(in srgb, var(--color-plant) 40%, transparent);
	}

	.filterChip.bee.inline:hover{
		background-color: color-mix(in srgb, var(--color-bee) 67%, transparent);
	}

	.filterChip.plant.inline:hover{
		background-color: color-mix(in srgb, var(--color-plant) 67%, transparent);
	}

	.close-unicode {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0 0 0 0.25rem;
		font-size: 20px; /* Adjust size of the 'X' */
		line-height: 0;
		position:relative;
		top:0.125rem;
	}

	/* Insert the X symbol using the 'times' ISO code */
	.close-unicode::after {
		content: "\00d7"; /* Unicode character for × */
		color: black;
		opacity: 0.6;
	}

	/* Optional hover feedback */
	.close-unicode:hover::after {
		opacity:1.0;
	}

</style>
