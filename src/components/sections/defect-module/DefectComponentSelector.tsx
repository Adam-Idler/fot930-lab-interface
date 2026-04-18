import clsx from 'clsx';

export interface DefectableComponent {
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

interface DefectComponentSelectorProps {
	selectedId: string | null;
	onSelect: (id: string) => void;
}

export function DefectComponentSelector({
	selectedId,
	onSelect
}: DefectComponentSelectorProps) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{FAULTY_COMPONENTS.map((component) => {
				const isSelected = selectedId === component.id;
				return (
					<button
						key={component.id}
						type="button"
						onClick={() => onSelect(component.id)}
						className={clsx(
							'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer text-center',
							isSelected
								? 'border-blue-500 bg-blue-50 text-blue-900'
								: 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
						)}
					>
						<img
							src={component.icon}
							alt={component.label}
							className="w-24 h-24 object-contain"
						/>
						<span className={clsx('text-sm font-medium leading-snug', isSelected ? 'text-blue-900' : 'text-gray-700')}>
							{component.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
