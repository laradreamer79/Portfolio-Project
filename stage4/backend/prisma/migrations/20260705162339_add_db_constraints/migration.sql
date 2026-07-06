-- Add positive value constraints
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_durationHours_positive" CHECK ("durationHours" > 0);
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_pricePerPerson_positive" CHECK ("pricePerPerson" > 0);
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_maxCapacity_positive" CHECK ("maxCapacity" > 0);

ALTER TABLE "Course" ADD CONSTRAINT "Course_price_positive" CHECK ("price" > 0);

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_numberOfPeople_positive" CHECK ("numberOfPeople" > 0);
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_totalPrice_positive" CHECK ("totalPrice" >= 0);
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_trip_or_course" CHECK (
    ("tripId" IS NOT NULL AND "courseId" IS NULL) OR
    ("tripId" IS NULL AND "courseId" IS NOT NULL)
);

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_amount_positive" CHECK ("amount" >= 0);

ALTER TABLE "Review" ADD CONSTRAINT "Review_rating_range" CHECK ("rating" BETWEEN 1 AND 5);