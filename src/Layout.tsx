import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Header } from './components/header';
import { AdmissionTest, LabWork, Theory } from './components/sections';
import { Tabs, useTabs } from './components/tabs';

export function Layout() {
	const { activeTab } = useTabs();

	return (
		<div className="min-w-3xl h-screen flex flex-col bg-gray-50">
			<Header />

			<div className="bg-white shadow-sm">
				<div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
					<Tabs />
				</div>
			</div>

			<main className="flex-1 overflow-auto">
				<div className="h-full max-w-400 mx-auto py-6 sm:px-6 lg:px-8">
					<TabContent active={activeTab === 'theory'}>
						<Theory />
					</TabContent>

					<TabContent active={activeTab === 'admission'}>
						<AdmissionTest />
					</TabContent>

					<TabContent active={activeTab === 'lab-work'}>
						<LabWork />
					</TabContent>
				</div>
			</main>
		</div>
	);
}

interface TabContentProps {
	children: ReactNode;
	active: boolean;
}

function TabContent({ children, active }: TabContentProps) {
	return <div className={clsx('h-full', { hidden: !active })}>{children}</div>;
}
