import { type PropsWithChildren, useMemo, useState } from 'react';
import type { Section } from '../../types';
import { TabsContext } from './tabsContext';

export function TabsProvider({ children }: PropsWithChildren) {
	const [activeTab, setActiveTab] = useState<Section>('theory');

	const value = useMemo(
		() => ({
			activeTab,
			setActiveTab
		}),
		[activeTab]
	);

	return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}
