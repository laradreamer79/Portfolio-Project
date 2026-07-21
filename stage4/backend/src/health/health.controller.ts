# يعيد إستجابه تثبت ان api يشتغل
import type { Request, Response } from "express";

export function getHealth(_request: Request, response: Response): void {
  response.status(200).json({
    status: "ok",
    service: "oyster-api",
  });
}
# يستخدم في اختبار تشغيل السيرفر ودوكر هيلث تشيك والمراقبه
