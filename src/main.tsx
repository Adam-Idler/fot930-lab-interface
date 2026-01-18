import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { RegistrationProvider } from './components/registration-form';
import { TabsProvider } from './components/tabs';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RegistrationProvider>
			<TabsProvider>
				<App />
			</TabsProvider>
		</RegistrationProvider>
	</StrictMode>
);
