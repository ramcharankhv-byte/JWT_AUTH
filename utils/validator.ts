import { ApiError } from "./ApiError.js";

export const validate = (schema: any, source = "body") => {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      throw new ApiError(400, result.error.issues[0].message);
    }

    req.validatedData = result.data;

    next();
  };
};
