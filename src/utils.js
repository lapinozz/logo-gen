import Vec from './vec.js'

export function lineLineIntersection(p1, p2, p3, p4)
{
	const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

	const x = ((p1.x*p2.y - p1.y*p2.x) * (p3.x - p4.x) - (p1.x - p2.x) * (p3.x*p4.y - p3.y*p4.x)) / d;
	const y = ((p1.x*p2.y - p1.y*p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x*p4.y - p3.y*p4.x)) / d;

	return new Vec(x, y);
}

export function circleSegmentIntersection(center, radius, p1, p2){
    var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
    v1 = {};
    v2 = {};
    v1.x = p2.x - p1.x;
    v1.y = p2.y - p1.y;
    v2.x = p1.x - center.x;
    v2.y = p1.y - center.y;
    b = (v1.x * v2.x + v1.y * v2.y);
    c = 2 * (v1.x * v1.x + v1.y * v1.y);
    b *= -2;
    d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - radius * radius));
    if(isNaN(d)){ // no intercept
        return [];
    }
    u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
    u2 = (b + d) / c;    
    retP1 = {};   // return points
    retP2 = {}  
    ret = []; // return array
    if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
        retP1.x = p1.x + v1.x * u1;
        retP1.y = p1.y + v1.y * u1;
        ret[0] = retP1;
    }
    if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
        retP2.x = p1.x + v1.x * u2;
        retP2.y = p1.y + v1.y * u2;
        ret[ret.length] = retP2;
    }       
    return ret;
}

export function downloadSvg(svg)
{
	var svgData = svg.outerHTML;
	var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
	var svgUrl = URL.createObjectURL(svgBlob);
	var downloadLink = document.createElement("a");
	downloadLink.href = svgUrl;
	downloadLink.download = "newesttree.svg";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}

export function makeDiv(type, attributes)
{
    if(typeof type == 'object')
    {
        attributes = type;
        type = 'div';
    }

    const el = document.createElement(type);

    for(const attr in attributes)
    {
        const value = attributes[attr];

        if(attr == 'class' || attr == 'classes' || attr == 'classList')
        {
            if(typeof value == "string")
            {
                value = [value];
            }

            for(const className of value)
            {
                el.classList.add(className);
            }
        }
        else if(attr == 'parent')
        {
            value.appendChild(el);
        }
        else
        {
            el[attr] = value;
        }
    }

    return el;
}