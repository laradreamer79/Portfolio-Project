import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
# بدل مايفتح كونكشن جديد لكل ركوست يعيد إستخدام الإتصال

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
# يسوي كونكشن بول

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});
# يسوي نسخه بريزما وحده يستخدمها المشروع كله

# ليه؟ عشان لوسوينا بريزما جديد داخل كل سيرفر راح يفتح إتصالات كثيره ترهق الداتا بيس
