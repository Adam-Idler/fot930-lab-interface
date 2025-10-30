import { Tab, type TabProps } from './Tab';

interface TabsProps {
	tabs: TabProps[];
}

export function Tabs({ tabs }: TabsProps) {
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
