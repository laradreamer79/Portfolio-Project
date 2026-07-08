export class ReviewEntity {

  id!: number;

  rating!: number;

  comment?: string;

  createdAt!: Date;

  updatedAt!: Date;

  userId!: number;

  centerId!: number;

  tripId?: number;

  courseId?: number;

}
