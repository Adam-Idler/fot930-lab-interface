import { Tab, type TabProps } from './Tab';

const tabs: TabProps[] = [
	{
		id: 'theory',
		label: 'Теория'
	},
	{
		id: 'admission',
		label: 'Тест-допуск'
	}
];

export function Tabs() {
	return (
		<div className="bg-white border-b border-gray-200">
			<nav className="flex space-x-8" aria-label="Tabs">
				{tabs.map((tabProps) => (
					<Tab key={tabProps.id} {...tabProps} />
				))}
			</nav>
		</div>
	);
}
