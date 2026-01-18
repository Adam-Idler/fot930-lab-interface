import clsx from 'clsx';
import type { Section } from '../../types';
import { useTabs } from './tabsContext';

export interface TabProps {
	id: Section;
	label: string;
	disabled?: boolean;
}

export function Tab({ id, label, disabled }: TabProps) {
	const { activeTab, setActiveTab } = useTabs();

	const isActive = activeTab === id;

	const onClickHandler = () => {
		setActiveTab(id);
	};

	return (
		<button
			type="button"
			key={id}
			onClick={onClickHandler}
			disabled={disabled}
			className={clsx(
				'whitespace-nowrap py-4 px-1 border-b-2 -mb-px font-medium text-sm',
				isActive
					? 'border-blue-500 text-blue-600'
					: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
				disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
			)}
		>
			{label}
		</button>
	);
}
