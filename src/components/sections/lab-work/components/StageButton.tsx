import clsx from 'clsx';
import type { LabStage } from '../../../../types/fot930';

interface StageButtonProps {
	stage: LabStage;
	label: string;
	active: boolean;
	onClick: () => void;
	disabled?: boolean;
	title?: string;
}

export function StageButton({
	label,
	active,
	onClick,
	disabled,
	title
}: StageButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			title={title}
			className={clsx(
				'px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition',
				active
					? 'bg-blue-600 text-white shadow-lg'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
				disabled ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'
			)}
		>
			{label}
		</button>
	);
}
