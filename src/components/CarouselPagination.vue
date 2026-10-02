<template>
	<div class="carousel-pagination" v-if="total > 1">
		<button
			class="carousel-pagination__btn prev"
			aria-label="Previous observation"
			:disabled="activeIndex === 0"
			@click="$emit('prev')"
		>
			<svg viewBox="0 0 10 10" class="triangle" aria-hidden="true">
				<polygon points="8,1 8,9 1,5" />
			</svg>
		</button>

		<span class="carousel-pagination__count">{{ activeIndex + 1 }} of {{ total }}</span>

		<button
			class="carousel-pagination__btn next"
			aria-label="Next observation"
			:disabled="activeIndex === total - 1"
			@click="$emit('next')"
		>
			<svg viewBox="0 0 10 10" class="triangle" aria-hidden="true">
				<polygon points="2,1 2,9 9,5" />
			</svg>
		</button>
	</div>
</template>

<script>
export default {
	name: 'CarouselPagination',
	props: {
		activeIndex: {
			type: Number,
			default: 0
		},
		total: {
			type: Number,
			default: 0
		}
	},
	emits: ['prev', 'next']
}
</script>

<style lang="css" scoped>

	.carousel-pagination{
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		background-color: #939393;
		color: #ffffff;
		border-radius: 999px;
		padding: 0.3rem 0.3rem;
		line-height: 1;
	}

	.carousel-pagination__count{
		font-size: 75%;
		font-weight: 300;
		color: #ffffff;
		white-space: nowrap;
	}

	.carousel-pagination__btn{
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
	}

	.carousel-pagination__btn .triangle{
		width: 0.7rem;
		height: 0.7rem;
		fill: currentColor;
		opacity:0.8;
	}

	.carousel-pagination__btn:disabled{
		opacity: 0.35;
		cursor: default;
	}

	.carousel-pagination__btn:hover .triangle{
		opacity:1;
	}

</style>
