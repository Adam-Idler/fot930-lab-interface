import type { LabStage } from '../../../../types/fot930';

interface StageButtonProps {
	stage: LabStage;
	label: string;
	active: boolean;
	onClick: () => void;
}

export function StageButton({ label, active, onClick }: StageButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition hover:cursor-pointer ${
				active
					? 'bg-blue-600 text-white shadow-lg'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
			}`}
		>
			{label}
		</button>
	);
}
