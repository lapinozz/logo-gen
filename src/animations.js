import Vec from './vec.js'
import {lineLineIntersection, circleSegmentIntersection} from './utils.js'

import anime from 'animejs'

export function addKeyframe(svg, timeline, attributes)
{
	let elem = attributes['elem'];
	if(typeof elem == 'string')
	{
		elem = svg.getElementById(elem);
	}

	if(!elem)
	{
		return;
	}

	delete attributes['elem'];

	if(attributes['stroke'] || attributes['stroke-reversed'])
	{
		attributes.attr = 'stroke-dashoffset';
		attributes.elemAttr = attributes.elemAttr || {};

		let length = 1;
		if(elem.tagName == 'line')
		{
			const x1 = parseFloat(elem.getAttribute('x1'));
			const y1 = parseFloat(elem.getAttribute('y1'));
			const x2 = parseFloat(elem.getAttribute('x2'));
			const y2 = parseFloat(elem.getAttribute('y2'));

			const p1 = new Vec(x1, y1);
			const p2 = new Vec(x2, y2);

			length = p2.sub(p1).length();
		}
		else
		{
			length = elem.pathLength;
		}

		attributes.elemAttr['stroke-dasharray'] = length;
		elem.setAttribute('stroke-dasharray', length);

		if(attributes['stroke-reversed'])
		{
			attributes.from = 0;
			attributes.to = length;
		}
		else
		{
			attributes.from = length;
			attributes.to = 0;
		}
	}

    const {attr, duration, from, to, dur, easing, offset} = attributes;

    const keyframes = [{duration: 0}, {duration: dur}];
    keyframes[0][attr] = from;
    keyframes[1][attr] = to;

    timeline.add({
    	targets: elem,
    	duration: dur,
    	easing: easing || 'linear',
    	keyframes
	}, offset || '+=0');
}

function basic(svg, settings, lOffset0, lOffset1)
{
	const {lineWidth} = settings;

	console.log(settings)

	const timeline = anime.timeline({
		loop: !!settings.loop,
		direction: settings.alternate ? 'alternate' : 'normal'
	});

	const add = (attrs) => addKeyframe(svg, timeline, attrs);

	add({
		elem: 'circle',
		attr: 'stroke-width',
		from: 0,
		to: lineWidth,
		dur: 200,
		easing: 'easeInOutQuad'
	});

	const lineTemplate = {
		dur: 250,
		stroke: true,
		easing: 'easeInOutQuad'
	};

	add({
		...lineTemplate,
		elem: 'zSegment0',
		offset: '-=100'
	});

	add({
		...lineTemplate,
		elem: 'zSegment1',
	});

	add({
		...lineTemplate,
		elem: 'zSegment2',
	});

	add({
		...lineTemplate,
		elem: 'lSegment0',
		offset: lOffset0,
	});

	add({
		...lineTemplate,
		elem: 'lSegment1',
		offset: lOffset1,
	});

	return timeline;
}

function semiSyncroEnd(svg, settings)
{
	return basic(svg, settings, '-=250');
}

function syncroEnd(svg, settings)
{
	return basic(svg, settings, '-=500', '-=250');
}

const anims = { basic, semiSyncroEnd, syncroEnd};
export {anims};

export default function animate(svg, settings)
{
	const func = anims[settings.anim];
	return func && func(svg, settings);
}