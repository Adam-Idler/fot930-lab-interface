interface DefectableComponent {
	id: string;
	label: string;
	icon: string;
}

export const FAULTY_COMPONENTS: DefectableComponent[] = [
	{
		id: 'optical_cable_2',
		label: 'Оптический шнур simplex SC/UPC G.657 (3 м)',
		icon: '/images/scheme/sc-upc-g-657.jpg'
	},
	{
		id: 'splitter_1_2',
		label: 'Сплиттер 1:2 SC/APC',
		icon: '/images/scheme/splitter-1-2.png'
	}
];
