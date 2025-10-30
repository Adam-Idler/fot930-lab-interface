import { Header } from './components/header';
import { AdmissionTest, Theory } from './components/sections';
import { Tabs, useTabs } from './components/tabs';
import { Show } from './lib/components';

export const Layout = () => {
	const { activeTab } = useTabs();

	return (
		<div className="min-w-3xl h-screen flex flex-col bg-gray-50">
			<Header />

			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Tabs />
				</div>
			</div>

			<main className="flex-1 overflow-auto">
				<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
					<Show when={activeTab === 'theory'}>
						<Theory />
					</Show>

					<Show when={activeTab === 'admission'}>
						<AdmissionTest />
					</Show>
				</div>
			</main>
		</div>
	);
};
