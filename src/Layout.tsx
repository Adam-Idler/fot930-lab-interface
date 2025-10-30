import { type ComponentType, useState } from 'react';
import { AdmissionTest } from './components/sections/AdmissionTest';
import { Theory } from './components/sections/Theory';
import { Tabs } from './components/tabs/Tabs';

export type Tab = {
	id: string;
	label: string;
	component: ComponentType;
};

export type Section = 'theory' | 'admission';

export const Layout = () => {
	const [activeSection, setActiveSection] = useState<Section>('theory');

	const tabs = [
		{
			id: 'theory',
			label: 'Теория',
			isActive: activeSection === 'theory',
			onClick: () => setActiveSection('theory')
		},
		{
			id: 'admission',
			label: 'Тест-допуск',
			isActive: activeSection === 'admission',
			onClick: () => setActiveSection('admission')
		}
	];

	const renderSection = () => {
		switch (activeSection) {
			case 'theory':
				return <Theory />;
			case 'admission':
				return <AdmissionTest />;
			default:
				return <Theory />;
		}
	};

	return (
		<div className="h-screen flex flex-col bg-gray-50">
			{/* Заголовок приложения */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<h1 className="text-base font-semibold text-gray-900">Лабораторная работа: Измерения оптическим тестером FOT-930</h1>
						<div className="text-sm text-gray-500">Студент: Иванов И.И.{/* Добавьте компонент авторизации */}</div>
					</div>
				</div>
			</header>

			{/* Навигационные табы */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Tabs tabs={tabs} />
				</div>
			</div>

			{/* Основной контент */}
			<main className="flex-1 overflow-auto">
				<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{renderSection()}</div>
			</main>
		</div>
	);
};
