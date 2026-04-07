// types/express/index.d.ts
import { modelAuthorsType } from "../../src/Types/auth.type";

declare global {
  namespace Express {
    interface Request {
      user?: modelAuthorsType;
    }
  }
}
