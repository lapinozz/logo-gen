import Vec from './vec.js'
import {lineLineIntersection, circleSegmentIntersection} from './utils.js'

export default function drawLogo(settings)
{
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

	const appendSvg = (type, attributes, targetSvg) =>
	{
		if(!targetSvg) targetSvg = svg;

		const el = document.createElementNS('http://www.w3.org/2000/svg', type);
		for(let attr in attributes)
		{
			el.setAttribute(attr, attributes[attr]);
		}

		targetSvg.appendChild(el);

		return el;
	};

	const {radius, padding, lineWidth, lStartAngle, zAngles0, zAngles1, zAngles2} = settings;

	const size = new Vec((radius + padding) * 2, (radius + padding) * 2);
	const center = size.div(2)

	const scale = 3; 
	svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	svg.setAttribute('width', size.x * scale + 'px');
	svg.setAttribute('height', size.y * scale + 'px');

	svg.setAttribute("preserveAspectRatio", "xMidYMin meet");
	svg.setAttribute("viewBox", `0 0 ${size.x} ${size.y}`);

	appendSvg('circle', {
		cx: center.x,
		cy: center.y,
		r: radius,
		fill: "none",
		stroke: "red",
		'stroke-width': lineWidth
	});

	const zAngles = [
		zAngles0 - 90,
		-zAngles0 - 90,
		zAngles1 - 90,
		zAngles2 - 90
	];

	const zPoints = zAngles.map(a => Vec.fromAngle(a).mul(radius).add(center));

	const zSegments = [];

	for(let x = 0; x < zPoints.length - 1; x++)
	{
		const p1 = zPoints[x];
		const p2 = zPoints[x + 1];

		zSegments.push({p1, p2});

		appendSvg('line', {
			x1: p1.x,
			y1: p1.y,
			x2: p2.x,
			y2: p2.y,
			r: radius,
			fill: "none",
			stroke: "red",
			'stroke-width': lineWidth
		});
	}

	const lStart = Vec.fromAngle(lStartAngle - 90).mul(radius).add(center);

	const lMid = lineLineIntersection(zSegments[1].p1, zSegments[1].p2, lStart, lStart.add(0, 1));

	const lEnd = circleSegmentIntersection(center, radius, lMid, lMid.add(zSegments[2].p2.sub(zSegments[2].p1).normalize().mul(radius * radius)))[0];

	//for(let x = 0; x < zPoints.length - 1; x++)
	{
		const p1 = lStart;
		const p2 = center;

		appendSvg('line', {
			x1: lStart.x,
			y1: lStart.y,
			x2: lMid.x,
			y2: lMid.y,
			r: radius,
			fill: "none",
			stroke: "red",
			'stroke-width': lineWidth
		});

		appendSvg('line', {
			x1: lEnd.x,
			y1: lEnd.y,
			x2: lMid.x,
			y2: lMid.y,
			r: radius,
			fill: "none",
			stroke: "red",
			'stroke-width': lineWidth
		});
	}
	
	return svg;
}