import clsx from 'clsx';

export interface TabProps {
	id: string;
	label: string;
	isActive: boolean;
	onClick: () => void;
	disabled?: boolean;
}

export function Tab({ id, label, isActive, onClick, disabled }: TabProps) {
	return (
		<button
			type="button"
			key={id}
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
				isActive ? 'border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
				disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
			)}
		>
			{label}
		</button>
	);
}
