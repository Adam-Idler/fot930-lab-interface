import clsx from 'clsx';
import { type ReactNode, useEffect, useRef } from 'react';
import { Header } from './components/header';
import { AdmissionTest, LabWork, Theory } from './components/sections';
import { Tabs, useTabs } from './components/tabs';
import type { Section } from './types';

export function Layout() {
	const { activeTab } = useTabs();
	const scrollPositions = useRef<Partial<Record<Section, number>>>({});

	// Непрерывно сохраняем позицию текущей вкладки по событию scroll,
	// чтобы не читать scrollTop после скрытия контента (display:none обрезает его)
	useEffect(() => {
		const scrollEl = document.getElementById('main-scroll');
		if (!scrollEl) return;

		const handleScroll = () => {
			scrollPositions.current[activeTab] = scrollEl.scrollTop;
		};

		scrollEl.addEventListener('scroll', handleScroll, { passive: true });
		return () => scrollEl.removeEventListener('scroll', handleScroll);
	}, [activeTab]);

	// Восстанавливаем позицию при смене вкладки
	useEffect(() => {
		const scrollEl = document.getElementById('main-scroll');
		if (!scrollEl) return;

		const savedPosition = scrollPositions.current[activeTab] ?? 0;
		scrollEl.scrollTo({ top: savedPosition, behavior: 'instant' });
	}, [activeTab]);

	return (
		<div className="min-w-3xl h-screen flex flex-col bg-gray-50">
			<Header />

			<div className="bg-white shadow-sm">
				<div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
					<Tabs />
				</div>
			</div>

			<main id="main-scroll" className="flex-1 overflow-auto">
				<div className="h-full max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
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
