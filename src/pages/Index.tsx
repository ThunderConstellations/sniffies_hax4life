import { useAppStore } from '@/lib/store';
import CalculatorDecoy from '@/pages/CalculatorDecoy';
import MainApp from '@/pages/MainApp';

const Index = () => {
  const { unlocked, settings } = useAppStore();

  // If incognito mode is off, go straight to app
  if (!settings.incognitoEnabled || unlocked) {
    return <MainApp />;
  }

  return <CalculatorDecoy />;
};

export default Index;
