import { AppHeader } from "./components/layout/AppHeader";
import { NewCalendarModal } from "./components/modals/NewCalendarModal";
import { NewEventModal } from "./components/modals/NewEventModal";
import { BottomNav } from "./components/navigation/BottomNav";
import { SideMenu } from "./components/navigation/SideMenu";
import { useAppUi } from "./hooks/useAppUi";
import { useHideHeader } from "./hooks/useHideHeader";
import { useIsMobile } from "./hooks/useIsMobile";
import { useSplash } from "./hooks/useSplash";
import { CalendarMobile } from "./pages/CalendarMobile";
import { CalendarPage } from "./pages/CalendarPage";
import { Home } from "./pages/Home";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { Login } from "./pages/Login";
import { Settings } from "./pages/Settings";
import { useTelicore } from "./telicore/kernel/useTelicore";

export function App() {
  const isMobile = useIsMobile();
  const hideHeader = useHideHeader();
  const splash = useSplash();
  const ui = useAppUi();
  const core = useTelicore();

  async function addEvent(event) {
    event.preventDefault();
    if (!ui.newEvent.text.trim()) return;

    await core.createEvent({
      ...ui.newEvent,
      calendarId: core.active === "todos" ? "academico" : core.active
    });

    ui.resetNewEvent();
    ui.closeEventModal();
  }

  async function createCalendar() {
    if (!ui.newCalendar.name.trim()) return;

    try {
      await core.createCalendar(ui.newCalendar);
      ui.resetNewCalendar();
      ui.closeCalendarModal();
    } catch (error) {
      console.error("No se pudo crear el calendario:", error);
    }
  }

  if (core.checkingAuth) {
    return (
      <main className="login-screen">
        <div className="login-card">
          <div className="splash-mark">T</div>
          <strong>TELISI</strong>
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  if (!core.user) return <Login />;

  const calendarProps = {
    year: core.year,
    setYear: core.setYear,
    calendars: core.calendars,
    active: core.active,
    setActive: core.setActive,
    visibleEvents: core.visibleEvents,
    newEvent: ui.newEvent,
    setNewEvent: ui.setNewEvent,
    addEvent,
    deleteEvent: core.deleteEvent,
    openModal: ui.openCalendarModal,
    openEventModal: ui.openEventModal
  };

  return (
    <main
      className={`shell app-theme-${core.appTheme}`}
      style={{ "--accent": "var(--brand)" }}
    >
      <AppHeader
  view={ui.view}
  hideHeader={hideHeader}
  onOpenMenu={ui.openMenu}
  onNavigate={ui.setView}
/>

      <SideMenu
        isOpen={ui.menuOpen}
        onClose={ui.closeMenu}
        onNavigate={ui.setView}
        activeView={ui.view}
      />

      <div className="view-fade" key={ui.view}>
        {ui.view === "home" && (
          <Home
            user={core.user}
            calendars={core.calendars}
            events={core.events}
            nextEvent={core.nextEvent}
            todayEvents={core.todayEvents}
            setActive={core.setActive}
            setView={ui.setView}
            openModal={ui.openCalendarModal}
          />
        )}

        {ui.view === "calendar" && (
          isMobile ? (
            <CalendarMobile {...calendarProps} />
          ) : (
            <CalendarPage
              {...calendarProps}
              openEventModal={ui.openEventModal}
            />
          )
        )}

        {ui.view === "integrations" && <IntegrationsPage />}

        {ui.view === "settings" && (
          <Settings
            appTheme={core.appTheme}
            setAppTheme={core.setAppTheme}
            exportData={core.exportData}
          />
        )}
      </div>

      <BottomNav
  view={ui.view}
  setView={ui.setView}
  openEventModal={ui.openEventModal}
/>

      {splash && (
        <div className="splash-screen">
          <div className="splash-mark">T</div>
          <strong>TELISI</strong>
          <span>Organizá tu día.</span>
        </div>
      )}

      {ui.calendarModalOpen && (
        <NewCalendarModal
          newCal={ui.newCalendar}
          setNewCal={ui.setNewCalendar}
          createCalendar={createCalendar}
          closeModal={ui.closeCalendarModal}
        />
      )}

      {ui.eventModalOpen && (
        <NewEventModal
          newEvent={ui.newEvent}
          setNewEvent={ui.setNewEvent}
          addEvent={addEvent}
          closeModal={ui.closeEventModal}
        />
      )}
    </main>
  );
}
