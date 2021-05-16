import "./style/main.scss";

import drawLogo from "./logo";
import {makeDiv, downloadSvg} from "./utils";


window.onload = () => 
{
	const settings = {
		radius: 136,
		padding: 10,
		lineWidth: 20,
		lStartAngle: -15 + 360,
		zAngles0: -60 + 360,
		zAngles1: -110 + 360,
		zAngles2: 140,
	};

	const settingsDef = [
		{
			id: 'radius',
			name: 'Radius',
			range: [10, 1000],
		},
		{
			id: 'padding',
			name: 'Padding',
			range: [0, 30],
		},
		{
			id: 'lineWidth',
			name: 'Lines Width',
			range: [1, 50],
		},
		{
			id: 'lStartAngle',
			name: 'L Position',
			range: [0, 360],
		},
		{
			id: 'zAngles0',
			name: 'Z position (Start)',
			range: [0, 360],
		},
		{
			id: 'zAngles1',
			name: 'Z position (Mid)',
			range: [0, 360],
		},
		{
			id: 'zAngles2',
			name: 'Z position (End)',
			range: [0, 360],
		},
	];

	const container = makeDiv({
		parent: document.body,
		className: 'container'
	});

	const settingsDiv = makeDiv({
		parent: container,
		className: 'settingsDiv'
	});

	const logoDiv = makeDiv({
		parent: container,
		className: 'logoDiv'
	});

	const redraw = () => {
		logoDiv.innerHTML = '';
		logoDiv.appendChild(drawLogo(settings));
	};

	const table = makeDiv('table', {
		parent: settingsDiv,
		className: 'table'
	});

	for(const def of settingsDef)
	{
		const row = makeDiv('tr', {
			parent: table,
			className: 'row'
		});

		const labelCell = makeDiv('td', {
			parent: row,
			className: 'labelCell'
		});

		const label = makeDiv('div', {
			parent: labelCell,
			className: 'label',
			innerText: def.name,
		});

		const sliderCell = makeDiv('td', {
			parent: row,
			className: 'sliderCell'
		});

		const slider = makeDiv('input', {
			parent: sliderCell,
			type: 'range',
			className: 'slider',
			min: def.range[0],
			max: def.range[1],
			value: settings[def.id],
		});

		const numberCell = makeDiv('td', {
			parent: row,
			className: 'numberCell'
		});

		const number = makeDiv('input', {
			parent: numberCell,
			className: 'number',
			value: settings[def.id],
		});

		const onChange = (val) => {
			val = parseInt(val);
			slider.value = val;
			number.value = val;
			settings[def.id] = val;
			redraw();
		};

		slider.oninput = () => onChange(slider.value);
		number.onchange = () => onChange(number.value);
	}

	const download = makeDiv('input', {
		parent: settingsDiv,
		type: 'button',
		className: 'download',
		value: 'Download',
		onclick: () => downloadSvg(logoDiv.children[0])
	});

	redraw();
};