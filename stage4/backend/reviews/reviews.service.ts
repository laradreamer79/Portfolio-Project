import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ReviewsService {


constructor(
 private prisma:PrismaService
){}



async create(
 userId:number,
 data:any
){

return this.prisma.review.create({

data:{
 userId,
 centerId:data.centerId,
 tripId:data.tripId,
 courseId:data.courseId,
 rating:data.rating,
 comment:data.comment,
}

});

}



async findAll(){

return this.prisma.review.findMany({

include:{
 user:true,
 trip:true,
 course:true,
 center:true,
}

});

}


}
