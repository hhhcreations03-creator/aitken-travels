import { createManualBooking } from "../../../actions";
import { BookingForm } from "@/components/admin/BookingForm";
import { PageTitle, Panel } from "@/components/admin/ui";
import { getSettings } from "@/lib/booking/settings";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const settings = await getSettings();
  return (
    <div className="max-w-[1000px]">
      <PageTitle title="New booking" />
      <p className="mb-6 max-w-[60ch] text-[14px] text-charcoal-soft">
        Add bookings taken by phone, WhatsApp, email or at the desk, and bookings from Booking.com, so the website never offers the same room twice.
      </p>
      <Panel>
        <BookingForm action={createManualBooking} currency={settings.currency} submitLabel="Create booking" isNew />
      </Panel>
    </div>
  );
}
