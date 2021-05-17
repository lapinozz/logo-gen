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

	const {radius, padding, lineWidth, lStartAngle, zAngles0, zAngles1, zAngles2, isPath} = settings;

	const size = new Vec((radius + padding) * 2, (radius + padding) * 2);
	const center = size.div(2)

	const scale = 3; 
	svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	svg.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
	svg.setAttribute('version', "1.1");
	svg.setAttribute('width', size.x * scale + 'px');
	svg.setAttribute('height', size.y * scale + 'px');

	svg.setAttribute("preserveAspectRatio", "xMidYMin meet");
	svg.setAttribute("viewBox", `0 0 ${size.x} ${size.y}`);

	const addCircle = (center, radius, lineWidth, stroke, id) => {
		if(isPath)
		{
			appendSvg('circle', {
				cx: center.x,
				cy: center.y,
				r: radius - lineWidth / 2,
				fill: "none",
				stroke: stroke,
				'stroke-width': 1
			});

			appendSvg('circle', {
				cx: center.x,
				cy: center.y,
				r: radius + lineWidth / 2,
				fill: "none",
				stroke: stroke,
				'stroke-width': 1
			});
		}
		else
		{
			return appendSvg('circle', {
				cx: center.x,
				cy: center.y,
				r: radius,
				fill: "none",
				stroke: stroke,
				'stroke-width': lineWidth,
				id
			});
		}
	};

	const addLine = (p1, p2, lineWidth, stroke, id) => {
		if(isPath)
		{
			const vec = p2.sub(p1);
			const perp = new Vec(vec.y, -vec.x).normalize().mul(lineWidth / 2);

			appendSvg('line', {
				x1: p1.x + perp.x,
				y1: p1.y + perp.y,
				x2: p2.x + perp.x,
				y2: p2.y + perp.y,
				r: radius,
				fill: "none",
				stroke: "red",
				'stroke-width': 1
			});

			appendSvg('line', {
				x1: p1.x - perp.x,
				y1: p1.y - perp.y,
				x2: p2.x - perp.x,
				y2: p2.y - perp.y,
				r: radius,
				fill: "none",
				stroke: "red",
				'stroke-width': 1
			});
		}
		else
		{
			return appendSvg('line', {
				x1: p1.x,
				y1: p1.y,
				x2: p2.x,
				y2: p2.y,
				r: radius,
				fill: "none",
				stroke: "red",
				'stroke-width': lineWidth,
				id
			});
		}
	};

	addCircle(center, radius, lineWidth, 'red', 'circle');	

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

		addLine(p1, p2, lineWidth, "red", 'zSegment' + x);
	}

	const lStart = Vec.fromAngle(lStartAngle - 90).mul(radius).add(center);
	const lMid = lineLineIntersection(zSegments[1].p1, zSegments[1].p2, lStart, lStart.add(0, 1));
	const lEnd = circleSegmentIntersection(center, radius, lMid, lMid.add(zSegments[2].p2.sub(zSegments[2].p1).normalize().mul(radius * radius)))[0];

	addLine(lStart, lMid, lineWidth, "red", 'lSegment' + 0);
	addLine(lMid, lEnd, lineWidth, "red", 'lSegment' + 1);
		
	return svg;
}