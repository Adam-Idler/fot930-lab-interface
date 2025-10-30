import { TabsProvider } from './components/tabs/TabsProvider';
import { Layout } from './Layout';

export function App() {
	return (
		<TabsProvider>
			<Layout />
		</TabsProvider>
	);
}
