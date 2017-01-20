const sum = xs => {
	let s = 0;

	for (let i = 0; i < xs.length; i++) {
		s += xs[i];
	}
	return s;
}

function id(x) {
	return x;
}

function max(arr){
	return max_by(arr, id);
}

function max_index(arr){
	return max_index_by(arr,id);
}

function max_by(arr, value){
	var index = max_index_by(arr, value);
	return arr[index];
}

function max_index_by(arr, value){
	var index = 0;
	var maxValue = value(arr[0]);
	for(let i = 1; i < arr.length; i++){
		let nextValue = value(arr[i])
		if(maxValue < nextValue){
			maxValue = nextValue
			index = i;
		}
	}
	return index;
}

//k-combinator
const k = x => () => x;
const const_null = k(null);

// list :: (int, int -> a) -> [a]
const list = (length, init = const_null) => {
	var arr = Array(length);
	for (let i = 0; i < length; i++){
		arr[i] = init(i);
	}
	return arr;
}

const replace = function(arr, i, x) {
	const left = arr.slice(0, i);
	const right = arr.slice(i + 1);

	return left.concat([x], right);
}

module.exports = {
	sum, id,
	max, max_index, max_by, max_index_by,
	list, replace
}