import Vec from './vec.js'
import {lineLineIntersection, circleSegmentIntersection} from './utils.js'

export function addAnim(svg, attributes)
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

	const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
	elem.appendChild(anim);

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

		if(attributes['stroke-reversed'])
		{
			attributes.elemAttr['stroke-dashoffset'] = 0;
			attributes.from = 0;
			attributes.to = length;
		}
		else
		{
			attributes.elemAttr['stroke-dashoffset'] = length;
			attributes.from = length;
			attributes.to = 0;
		}
	}

    for(let attr in attributes)
    {
        const value = attributes[attr];

        if(attr == 'attr')
        {
        	attr = 'attributeName';
        }

        if(attr == 'elemAttr')
        {
        	for(const a in value)
        	{
        		elem.setAttribute(a, value[a]);
        	}
        }
        else
        {
        	anim.setAttribute(attr, value);
        }
    }

    return anim;
}

function basic(svg, settings, lOffset = '0s')
{
	const {lineWidth} = settings;

	addAnim(svg, {
		start: true,
		id: 'circleAnim',
		elem: 'circle',
		attr: 'stroke-width',
		from: 0,
		to: lineWidth,
		dur: '0.5s',
		begin: 'indefinite',
		calcMode: "spline",
		keySplines: "0.4 0 0.2 1"
	});

	const lineTemplate = {
		dur: '0.25s',
		fill: "freeze",
		stroke: true,
		calcMode: "spline",
		keySplines: "0.4 0 0.2 1"
	};

	addAnim(svg, {
		...lineTemplate,
		id: 'zSegmentA',
		elem: 'zSegment0',
		begin: 'circleAnim.end - 0.2s',
	});

	addAnim(svg, {
		...lineTemplate,
		id: 'zSegmentB',
		elem: 'zSegment1',
		begin: 'zSegmentA.end',
	});

	addAnim(svg, {
		...lineTemplate,
		id: 'zSegmentC',
		elem: 'zSegment2',
		begin: 'zSegmentB.end',
	});

	addAnim(svg, {
		...lineTemplate,
		id: 'lSegmentA',
		elem: 'lSegment0',
		begin: 'zSegmentC.end - ' + lOffset,
	});

	addAnim(svg, {
		...lineTemplate,
		id: 'lSegmentB',
		elem: 'lSegment1',
		begin: 'lSegmentA.end',
	});
}

function semiSyncroEnd(svg, settings)
{
	basic(svg, settings, '0.25s');
}

function syncroEnd(svg, settings)
{
	basic(svg, settings, '0.5s');
}

const anims = { basic, semiSyncroEnd, syncroEnd};
export {anims};

export default function animate(svg, settings)
{
	const func = anims[settings.anim];
	func && func(svg, settings);
}