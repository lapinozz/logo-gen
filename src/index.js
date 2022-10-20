import "./style/main.scss";

import drawLogo from "./logo";
import animate, {anims} from "./animations";
import {makeDiv, downloadSvg} from "./utils";

let animTimeoutHandle = null;

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
		isPath: false,
		anim: 'basic',
		loop:  false,
		alternate:  false,
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
		{
			id: 'isPath',
			name: 'As Path',
			type: 'checkbox'
		},
		{
			id: 'anim',
			name: 'Animation',
			type: 'anim'
		},
		{
			id: 'loop',
			name: 'Loop',
			type: 'checkbox'
		},
		{
			id: 'alternate',
			name: 'Alternate',
			type: 'checkbox'
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

	const redraw = (final = true) => {
		const draw = (doAnim = false) => {
			logoDiv.innerHTML = '';
			const svg = drawLogo(settings);
			if(doAnim)
			{
				animate(svg, settings);
			}
			logoDiv.appendChild(svg);
		};

		draw();

		clearTimeout(animTimeoutHandle);
		animTimeoutHandle = setTimeout(() =>
		{
			draw(true);
		}, final ? 0 : 500);
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

		if(def.type == 'checkbox')
		{
			const checkboxCell = makeDiv('td', {
				parent: row,
				className: 'checkboxCell'
			});

			const checkbox = makeDiv('input', {
				parent: checkboxCell,
				type: 'checkbox',
				className: 'checkbox',
				checked: settings[def.id],
			});

			checkbox.onchange = () => {
				const val = checkbox.checked;
				settings[def.id] = val;
				redraw();
			}
		}
		else if(def.type == 'anim')
		{
			const dropdownCell = makeDiv('td', {
				parent: row,
				className: 'dropdownCell'
			});

			const select = makeDiv('select', {
				parent: dropdownCell,
				className: 'select',
			});

			for(const anim of ['none', ...Object.keys(anims)])
			{
				makeDiv('option', {
					parent: select,
					value: anim,
					innerText: anim
				})
			}

			select.value = settings[def.id];

			select.onchange = () => {
				const val = select.value;
				settings[def.id] = val;
				redraw();
			}
		}
		else
		{
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
				redraw(false);
			};

			slider.oninput = () => onChange(slider.value);
			number.onchange = () => onChange(number.value);
		}
	}

	const download = makeDiv('input', {
		parent: settingsDiv,
		type: 'button',
		className: 'download',
		value: 'Download',
		onclick: () => downloadSvg(logoDiv.children[0])
	});

	const play = makeDiv('input', {
		parent: settingsDiv,
		type: 'button',
		className: 'play',
		value: 'Play',
		onclick: redraw
	});

	redraw();
};