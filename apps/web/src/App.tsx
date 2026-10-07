import { usePathname } from './router';
import { pageForPath } from './catalog';
import { DemoProvider } from './app/demo';
import { ToastProvider } from './app/toast';
import { Shell } from './app/Shell';
import { NotFound } from './app/NotFound';
import { Landing } from './features/marketing/Landing';
import { Auth } from './features/auth/Auth';
import { TodayOverview, TodaySchedule, TodayCheckIn } from './features/today/Today';
import { PlanJourney, PlanWeek, PlanGoals } from './features/plan/PlanPages';
import { FoodDiary, FoodScan, FoodRecipes, FoodMealPlanner, FoodGroceries, FoodWater } from './features/food/FoodPages';
import { MoveWorkouts, MoveExercises, MoveYoga, MoveCardio, MoveHistory } from './features/move/MovePages';
import { WellbeingSleep, WellbeingRecovery, WellbeingBody, WellbeingHabits } from './features/wellbeing/WellbeingPages';
import { ProgressInsights, ProgressTrends, ProgressReports } from './features/progress/ProgressPages';
import { CoachChat, CoachVoice, CoachReviews } from './features/coach/CoachPages';
import { CommunityCircle, CommunityChallenges, CommunityCreators } from './features/community/CommunityPages';
import { RewardsOverview, RewardsHistory } from './features/rewards/RewardsPages';
import { ConnectionDevices, ConnectionApps, ConnectionImportExport } from './features/connections/ConnectionPages';
import { AccountProfile, AccountReminders, AccountPrivacy, AccountSettings } from './features/account/AccountPages';

/** Resolve a catalog id to its screen. Kept as a switch so a missing route fails loudly in review. */
function Screen({ id }: { id: string }) {
  switch (id) {
    case 'today/overview':
      return <TodayOverview />;
    case 'today/schedule':
      return <TodaySchedule />;
    case 'today/check-in':
      return <TodayCheckIn />;
    case 'plan/journey':
      return <PlanJourney />;
    case 'plan/week':
      return <PlanWeek />;
    case 'plan/goals':
      return <PlanGoals />;
    case 'food/diary':
      return <FoodDiary />;
    case 'food/scan':
      return <FoodScan />;
    case 'food/recipes':
      return <FoodRecipes />;
    case 'food/meal-planner':
      return <FoodMealPlanner />;
    case 'food/groceries':
      return <FoodGroceries />;
    case 'food/water':
      return <FoodWater />;
    case 'move/workouts':
      return <MoveWorkouts />;
    case 'move/exercises':
      return <MoveExercises />;
    case 'move/yoga':
      return <MoveYoga />;
    case 'move/cardio':
      return <MoveCardio />;
    case 'move/history':
      return <MoveHistory />;
    case 'wellbeing/sleep':
      return <WellbeingSleep />;
    case 'wellbeing/recovery':
      return <WellbeingRecovery />;
    case 'wellbeing/body':
      return <WellbeingBody />;
    case 'wellbeing/habits':
      return <WellbeingHabits />;
    case 'progress/insights':
      return <ProgressInsights />;
    case 'progress/trends':
      return <ProgressTrends />;
    case 'progress/reports':
      return <ProgressReports />;
    case 'coach/chat':
      return <CoachChat />;
    case 'coach/voice':
      return <CoachVoice />;
    case 'coach/reviews':
      return <CoachReviews />;
    case 'community/circle':
      return <CommunityCircle />;
    case 'community/challenges':
      return <CommunityChallenges />;
    case 'community/creators':
      return <CommunityCreators />;
    case 'rewards/overview':
      return <RewardsOverview />;
    case 'rewards/history':
      return <RewardsHistory />;
    case 'connections/devices':
      return <ConnectionDevices />;
    case 'connections/apps':
      return <ConnectionApps />;
    case 'connections/import-export':
      return <ConnectionImportExport />;
    case 'account/profile':
      return <AccountProfile />;
    case 'account/reminders':
      return <AccountReminders />;
    case 'account/privacy':
      return <AccountPrivacy />;
    case 'account/settings':
      return <AccountSettings />;
    default:
      return <NotFound />;
  }
}

export function AppRoutes() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === '') return <Landing />;
  if (pathname === '/login') return <Auth mode="login" />;
  if (pathname === '/register') return <Auth mode="register" />;

  const page = pageForPath(pathname);
  if (!page) return <NotFound />;

  return (
    <Shell>
      <Screen id={page.id} />
    </Shell>
  );
}

export function App() {
  return (
    <DemoProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </DemoProvider>
  );
}
