import clsx from 'clsx';
import { FAULTY_COMPONENTS } from './constants';

interface DefectComponentSelectorProps {
	selectedId: string | null;
	onSelect: (id: string) => void;
	completedIds?: string[];
}

export function DefectComponentSelector({
	selectedId,
	onSelect,
	completedIds = []
}: DefectComponentSelectorProps) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{FAULTY_COMPONENTS.map((component) => {
				const isSelected = selectedId === component.id;
				const isCompleted = completedIds.includes(component.id);
				return (
					<button
						key={component.id}
						type="button"
						disabled={isCompleted}
						onClick={() => onSelect(component.id)}
						className={clsx(
							'relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-colors text-center',
							isCompleted
								? 'border-green-500 bg-green-50 text-green-900 cursor-default'
								: isSelected
									? 'border-blue-500 bg-blue-50 text-blue-900 cursor-pointer'
									: 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
						)}
					>
						{isCompleted && (
							<span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
								✓
							</span>
						)}
						<img
							src={component.icon}
							alt={component.label}
							className="w-24 h-24 object-contain"
						/>
						<span
							className={clsx(
								'text-sm font-medium leading-snug',
								isCompleted
									? 'text-green-900'
									: isSelected
										? 'text-blue-900'
										: 'text-gray-700'
							)}
						>
							{component.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
