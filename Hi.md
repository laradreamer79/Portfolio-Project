,,, meramaid
classDiagram

class User {
    id int
    name string
    email string
    passwordHash string
    role string
    createdAt datetime

    +register() User
    +login() JWT
    +updateProfile() User
    +findById() User
}

class DivingCenter {
    id int
    name string
    city string
    address string
    licenseNumber string
    description string
    priceRange string
    contactEmail string
    contactPhone string
    ownerId int
    createdAt datetime

    +addTrip() Trip
    +addCourse() Course
    +getTrips() List~Trip~
    +getCourses() List~Course~
    +getAverageRating() float
    +addReview() Review
    +findByCity() List~DivingCenter~
}

class Trip {
    id int
    centerId int
    instructorId int
    title string
    description string
    durationHours int
    difficultyLevel string
    pricePerPerson decimal
    maxCapacity int
    scheduleDate date

    +checkAvailability() bool
    +getBookings() List~Booking~
    +getUpcoming() List~Trip~
}

class Course {
    id int
    centerId int
    instructorId int
    title string
    description string
    level string
    price decimal
    startDate date

    +getUpcoming() List~Course~
}

class Booking {
    id int
    userId int
    tripId int_optional
    courseId int_optional
    numberOfPeople int
    totalPrice decimal
    status string
    paymentIntentId string
    createdAt datetime

    +confirmPayment() void
    +cancel() void
    +findByUser() List~Booking~
}

class Payment {
    id int
    bookingId int
    amount decimal
    status string
    paymentMethod string
    stripePaymentId string
    createdAt datetime

    +processPayment() void
    +refund() void
}

class Review {
    id int
    userId int
    centerId int_optional
    tripId int_optional
    courseId int_optional
    rating int
    comment string
    createdAt datetime

    +validate() bool
    +getByCenter() List~Review~
}

User "1" --> "0..*" Booking : makes
User "1" --> "0..*" Review : writes
User "1" --> "0..*" Trip : instructs
User "1" --> "0..*" Course : teaches
User "1" --> "0..*" DivingCenter : owns

DivingCenter "1" --> "0..*" Trip : offers
DivingCenter "1" --> "0..*" Course : offers
DivingCenter "1" --> "0..*" Review : receives

Trip "1" --> "0..*" Booking : has
Course "1" --> "0..*" Booking : has

Trip "1" --> "0..*" Review : receives
Course "1" --> "0..*" Review : receives

Booking "1" --> "0..1" Payment : has
,,,
