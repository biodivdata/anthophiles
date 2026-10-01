// Lightweight, dependency-free helpers for syncing app state (filters +
// focused observation) with the URL query string, using conventional
// key=value query syntax (e.g. ?bee=Lasioglossum&plant=Taraxacum&obs=<id>).
//
// Filter changes are meaningful "checkpoints" worth a browser history entry
// (pushState), while focus/carousel navigation happens far more frequently
// and should not pollute browser history (replaceState).

const PARAM_BEE = 'bee';
const PARAM_PLANT = 'plant';
const PARAM_OBS = 'obs';

/**
 * Normalize a genus string coming from the URL so hand-typed / lowercase
 * values (e.g. ?bee=lasioglossum) still match the capitalized genus values
 * used internally (e.g. "Lasioglossum").
 */
export function normalizeGenus(value) {
	if (!value) return '';
	const trimmed = String(value).trim();
	if (!trimmed) return '';
	return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

/**
 * Read the current URL query string and return the raw (normalized) state
 * it encodes. Does not validate against the dataset - callers are
 * responsible for confirming the values actually exist before applying them.
 */
export function parseURLState() {
	const params = new URLSearchParams(window.location.search);
	return {
		bee: normalizeGenus(params.get(PARAM_BEE)),
		plant: normalizeGenus(params.get(PARAM_PLANT)),
		obs: (params.get(PARAM_OBS) || '').trim()
	};
}

/**
 * Build a query string (including leading "?") from the given state.
 * Empty/falsy values are omitted entirely rather than serialized as blank.
 */
export function buildURLQuery({ bee, plant, obs } = {}) {
	const params = new URLSearchParams();
	if (bee) params.set(PARAM_BEE, bee);
	if (plant) params.set(PARAM_PLANT, plant);
	if (obs) params.set(PARAM_OBS, obs);
	const query = params.toString();
	return query ? `?${query}` : '';
}

function buildURL(state) {
	return `${window.location.pathname}${buildURLQuery(state)}${window.location.hash || ''}`;
}

/**
 * Push a new history entry for a meaningful state change (e.g. the user
 * picked a new bee/plant filter combination). Skips the push if the
 * resulting URL is identical to the current one.
 */
export function pushURLState(state) {
	const url = buildURL(state);
	if (url === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
	window.history.pushState(state, '', url);
}

/**
 * Replace the current history entry in place (e.g. carousel focus changes
 * while swiping/paginating) so the back button isn't flooded with
 * intermediate steps.
 */
export function replaceURLState(state) {
	const url = buildURL(state);
	window.history.replaceState(state, '', url);
}

/**
 * Returns a debounced version of replaceURLState, useful for rapid-fire
 * updates such as swipe/scroll-driven carousel focus changes.
 */
export function debouncedReplaceURLState(delay = 350) {
	let timer = null;
	const fn = (state) => {
		clearTimeout(timer);
		timer = setTimeout(() => replaceURLState(state), delay);
	};
	fn.cancel = () => clearTimeout(timer);
	return fn;
}
